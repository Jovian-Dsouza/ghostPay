import { useState, useEffect, useCallback } from 'react';
import { paymentService } from '../services/paymentService';
import type { PaymentSession, PaymentSessionConfig } from '../types/payment';
import { SESSION_TIMEOUT } from '../config/shadowwire';

export function usePayment() {
  const [session, setSession] = useState<PaymentSession | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number>(SESSION_TIMEOUT);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = paymentService.onStatusChange((updatedSession) => {
      setSession(updatedSession);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!session || session.status === 'completed' || session.status === 'expired' || session.status === 'error') {
      return;
    }

    const interval = setInterval(() => {
      setTimeRemaining(paymentService.getTimeRemaining());
    }, 1000);

    return () => clearInterval(interval);
  }, [session]);

  const createPayment = useCallback(async (config: PaymentSessionConfig) => {
    setIsLoading(true);
    setError(null);

    try {
      const newSession = await paymentService.createSession(config);
      setSession(newSession);
      setTimeRemaining(SESSION_TIMEOUT);
      return newSession;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create payment session';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const cancelPayment = useCallback(() => {
    paymentService.cancelSession();
    setSession(null);
    setTimeRemaining(SESSION_TIMEOUT);
    setError(null);
  }, []);

  return {
    session,
    timeRemaining,
    isLoading,
    error,
    createPayment,
    cancelPayment,
  };
}
