import { useState, useEffect, useCallback, useRef } from 'react';
import { getBalance } from '../services/shadowWireService';
import { getOnchainBalance } from '../services/onchainBalance';
import { POLL_INTERVAL } from '../config/shadowwire';

const ONCHAIN_POLL_INTERVAL = 30_000;
const FAST_POLL_INTERVAL = 2_000;
const FAST_POLL_DURATION = 30_000;

export function useBalance(wallet: string | undefined) {
  const [balance, setBalance] = useState<number>(0);
  const [onchainBalance, setOnchainBalance] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const fastPollUntil = useRef<number>(0);

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

  const refreshAll = useCallback(async () => {
    await Promise.all([refresh(), refreshOnchain()]);
  }, [refresh, refreshOnchain]);

  // Trigger fast polling for both balances after a transaction
  const bustCache = useCallback(() => {
    fastPollUntil.current = Date.now() + FAST_POLL_DURATION;
    refreshAll();
  }, [refreshAll]);

  // ShadowWire balance polling — uses fast interval when active
  useEffect(() => {
    if (!wallet) {
      setLoading(false);
      return;
    }
    refresh();
    const id = setInterval(() => {
      const isFast = Date.now() < fastPollUntil.current;
      // Always run during fast poll; otherwise respect normal cadence
      if (isFast) refresh();
    }, FAST_POLL_INTERVAL);
    const normalId = setInterval(refresh, POLL_INTERVAL);
    return () => { clearInterval(id); clearInterval(normalId); };
  }, [wallet, refresh]);

  // On-chain balance polling — uses fast interval when active
  useEffect(() => {
    if (!wallet) return;
    refreshOnchain();
    const id = setInterval(() => {
      const isFast = Date.now() < fastPollUntil.current;
      if (isFast) refreshOnchain();
    }, FAST_POLL_INTERVAL);
    const normalId = setInterval(refreshOnchain, ONCHAIN_POLL_INTERVAL);
    return () => { clearInterval(id); clearInterval(normalId); };
  }, [wallet, refreshOnchain]);

  return { balance, onchainBalance, loading, refresh: bustCache };
}
