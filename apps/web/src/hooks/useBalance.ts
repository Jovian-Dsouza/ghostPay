import { useState, useEffect, useCallback } from 'react';
import { getBalance } from '../services/shadowWireService';
import { getOnchainBalance } from '../services/onchainBalance';
import { POLL_INTERVAL } from '../config/shadowwire';

const ONCHAIN_POLL_INTERVAL = 30_000;

export function useBalance(wallet: string | undefined) {
  const [balance, setBalance] = useState<number>(0);
  const [onchainBalance, setOnchainBalance] = useState<number>(0);
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

  const refreshOnchain = useCallback(async () => {
    if (!wallet) return;
    try {
      const onchain = await getOnchainBalance(wallet);
      setOnchainBalance(onchain);
    } catch {
      // keep last known value
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

  useEffect(() => {
    if (!wallet) return;
    refreshOnchain();
    const id = setInterval(refreshOnchain, ONCHAIN_POLL_INTERVAL);
    return () => clearInterval(id);
  }, [wallet, refreshOnchain]);

  return { balance, onchainBalance, loading, refresh };
}
