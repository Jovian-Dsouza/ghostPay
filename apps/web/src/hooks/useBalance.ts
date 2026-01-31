import { useState, useEffect, useCallback } from 'react';
import { getBalance } from '../services/shadowWireService';
import { POLL_INTERVAL } from '../config/shadowwire';

export function useBalance(wallet: string | undefined) {
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!wallet) return;
    try {
      const bal = await getBalance(wallet);
      setBalance(bal);
    } catch (e) {
      console.error('Balance fetch failed:', e);
    } finally {
      setLoading(false);
    }
  }, [wallet]);

  useEffect(() => {
    if (!wallet) {
      setLoading(false);
      return;
    }
    refresh();
    const id = setInterval(refresh, POLL_INTERVAL);
    return () => clearInterval(id);
  }, [wallet, refresh]);

  return { balance, loading, refresh };
}
