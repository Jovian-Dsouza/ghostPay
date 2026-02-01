import { useState, useEffect, useCallback, useRef } from 'react';
import { getBalance, getTransferFee } from '../services/shadowWireService';
import { POLL_INTERVAL, SESSION_TIMEOUT } from '../config/shadowwire';
import type { PaymentStatus } from '../types';

interface PaymentSession {
  recipient: string;
  amount: number;
  status: PaymentStatus;
  initialBalance: number;
  fee: number;
  received: number;
}

export function usePayment(wallet: string | undefined) {
  const [session, setSession] = useState<PaymentSession | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(SESSION_TIMEOUT);
  const pollRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);
  const timerRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const createdAtRef = useRef(0);

  const cancel = useCallback(() => {
    clearInterval(pollRef.current);
    clearInterval(timerRef.current);
    clearTimeout(timeoutRef.current);
    setSession(null);
    setTimeRemaining(SESSION_TIMEOUT);
  }, []);

  const startReceive = useCallback(async (amount: number) => {
    if (!wallet) return;
    cancel();

    const initialBalance = await getBalance(wallet);
    const fee = await getTransferFee(amount);
    const expectedAmount = amount - fee;
    createdAtRef.current = Date.now();

    const newSession: PaymentSession = {
      recipient: wallet,
      amount,
      status: 'waiting',
      initialBalance,
      fee,
      received: 0,
    };
    setSession(newSession);
    setTimeRemaining(SESSION_TIMEOUT);

    pollRef.current = setInterval(async () => {
      try {
        const current = await getBalance(wallet);
        const received = current - initialBalance;
        if (received >= expectedAmount) {
          clearInterval(pollRef.current);
          clearInterval(timerRef.current);
          clearTimeout(timeoutRef.current);
          setSession(s => s ? { ...s, status: 'verifying', received } : null);
          setTimeout(() => {
            setSession(s => s ? { ...s, status: 'completed' } : null);
          }, 1500);
        }
      } catch {
        // keep polling
      }
    }, POLL_INTERVAL);

    timerRef.current = setInterval(() => {
      setTimeRemaining(Math.max(0, SESSION_TIMEOUT - (Date.now() - createdAtRef.current)));
    }, 1000);

    timeoutRef.current = setTimeout(() => {
      setSession(s => s && s.status === 'waiting' ? { ...s, status: 'expired' } : s);
      clearInterval(pollRef.current);
      clearInterval(timerRef.current);
    }, SESSION_TIMEOUT);
  }, [wallet, cancel]);

  useEffect(() => cancel, [cancel]);

  return { session, timeRemaining, startReceive, cancel };
}
