export type PaymentStatus = 'pending' | 'waiting' | 'verifying' | 'completed' | 'expired' | 'error';

export interface PaymentSession {
  id: string;
  amount: number;
  token: string;
  tokenMint: string;
  status: PaymentStatus;
  createdAt: number;
  qrData: string;
  initialBalance: number;
  reference: string;
  errorMessage?: string;
}

export interface PaymentSessionConfig {
  amount: number;
  token: string;
  tokenMint: string;
}
