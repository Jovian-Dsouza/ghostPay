import { ShadowWireClient, type TokenSymbol } from '@radr/shadowwire';
import { MERCHANT_WALLET, POLL_INTERVAL, SESSION_TIMEOUT } from '../config/shadowwire';
import type { PaymentSession, PaymentSessionConfig, PaymentStatus } from '../types/payment';

type StatusChangeCallback = (session: PaymentSession) => void;

class PaymentService {
  private static instance: PaymentService;
  private shadowWireClient: ShadowWireClient | null = null;
  private currentSession: PaymentSession | null = null;
  private pollInterval: ReturnType<typeof setInterval> | null = null;
  private timeoutTimer: ReturnType<typeof setTimeout> | null = null;
  private statusChangeCallbacks: Set<StatusChangeCallback> = new Set();

  private constructor() {
    this.initializeShadowWire();
  }

  static getInstance(): PaymentService {
    if (!PaymentService.instance) {
      PaymentService.instance = new PaymentService();
    }
    return PaymentService.instance;
  }

  private initializeShadowWire(): void {
    if (!MERCHANT_WALLET) {
      console.warn('VITE_MERCHANT_WALLET not configured');
      return;
    }
    this.shadowWireClient = new ShadowWireClient();
  }

  onStatusChange(callback: StatusChangeCallback): () => void {
    this.statusChangeCallbacks.add(callback);
    return () => this.statusChangeCallbacks.delete(callback);
  }

  private notifyStatusChange(): void {
    if (this.currentSession) {
      this.statusChangeCallbacks.forEach(cb => cb(this.currentSession!));
    }
  }

  private generateReference(): string {
    // Reduced from 256 bits (32 bytes) to 128 bits (16 bytes)
    // Still provides sufficient uniqueness for payment tracking
    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);
    return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
  }

  private generateQRData(amount: number, tokenMint: string, reference: string): string {
    const params = new URLSearchParams();
    params.set('recipient', MERCHANT_WALLET);
    params.set('amount', amount.toString());
    params.set('reference', reference);

    if (tokenMint !== 'Native') {
      params.set('spl-token', tokenMint);
    }

    params.set('label', 'ghostPay');
    return `solana:${MERCHANT_WALLET}?${params.toString()}`;
  }

  async createSession(config: PaymentSessionConfig): Promise<PaymentSession> {
    if (!MERCHANT_WALLET) {
      throw new Error('Merchant wallet not configured');
    }

    // Cancel any existing session
    this.cancelSession();

    const reference = this.generateReference();
    const qrData = this.generateQRData(config.amount, config.tokenMint, reference);
    this.currentSession = {
      id: crypto.randomUUID(),
      amount: config.amount,
      token: config.token,
      tokenMint: config.tokenMint,
      status: 'waiting',
      createdAt: Date.now(),
      qrData,
      initialBalance: 0, // Will be updated asynchronously
      reference,
    };

    // Notify immediately so QR shows up without delay
    this.notifyStatusChange();
    this.startPolling();
    this.startTimeoutTimer();

    // Fetch initial balance asynchronously without blocking QR display
    if (this.shadowWireClient) {
      this.shadowWireClient.getBalance(MERCHANT_WALLET, config.token as TokenSymbol)
        .then(poolBalance => {
          if (this.currentSession && this.currentSession.id === this.currentSession.id) {
            this.currentSession.initialBalance = poolBalance.available || 0;
          }
        })
        .catch(error => {
          console.error('Failed to get initial balance:', error);
        });
    }

    return this.currentSession;
  }

  private startPolling(): void {
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
    }

    this.pollInterval = setInterval(() => {
      this.checkPaymentStatus();
    }, POLL_INTERVAL);
  }

  private startTimeoutTimer(): void {
    if (this.timeoutTimer) {
      clearTimeout(this.timeoutTimer);
    }

    this.timeoutTimer = setTimeout(() => {
      if (this.currentSession && this.currentSession.status === 'waiting') {
        this.updateStatus('expired');
        this.stopPolling();
      }
    }, SESSION_TIMEOUT);
  }

  private async checkPaymentStatus(): Promise<void> {
    if (!this.currentSession || !this.shadowWireClient) return;
    if (this.currentSession.status !== 'waiting' && this.currentSession.status !== 'verifying') return;

    try {
      const poolBalance = await this.shadowWireClient.getBalance(
        MERCHANT_WALLET,
        this.currentSession.token as TokenSymbol
      );

      const currentBalance = poolBalance.available || 0;
      const received = currentBalance - this.currentSession.initialBalance;

      if (received >= this.currentSession.amount) {
        this.updateStatus('verifying');

        // Brief verification delay then complete
        setTimeout(() => {
          if (this.currentSession) {
            this.updateStatus('completed');
            this.stopPolling();
          }
        }, 1500);
      }
    } catch (error) {
      console.error('Payment status check failed:', error);
    }
  }

  private updateStatus(status: PaymentStatus, errorMessage?: string): void {
    if (this.currentSession) {
      this.currentSession = {
        ...this.currentSession,
        status,
        errorMessage,
      };
      this.notifyStatusChange();
    }
  }

  private stopPolling(): void {
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
      this.pollInterval = null;
    }
    if (this.timeoutTimer) {
      clearTimeout(this.timeoutTimer);
      this.timeoutTimer = null;
    }
  }

  cancelSession(): void {
    this.stopPolling();
    this.currentSession = null;
  }

  getCurrentSession(): PaymentSession | null {
    return this.currentSession;
  }

  getTimeRemaining(): number {
    if (!this.currentSession) return 0;
    const elapsed = Date.now() - this.currentSession.createdAt;
    return Math.max(0, SESSION_TIMEOUT - elapsed);
  }
}

export const paymentService = PaymentService.getInstance();
