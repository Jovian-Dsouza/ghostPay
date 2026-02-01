export const MERCHANT_WALLET = import.meta.env.VITE_MERCHANT_WALLET || '';

export const SKIP_ONBOARDING = import.meta.env.VITE_SKIP_ONBOARDING || false;

export const POLL_INTERVAL = 3000; // 3 seconds

export const SESSION_TIMEOUT = 5 * 60 * 1000; // 5 minutes in milliseconds

export const SHADOWWIRE_CONFIG = {
  merchantWallet: MERCHANT_WALLET,
  pollInterval: POLL_INTERVAL,
  sessionTimeout: SESSION_TIMEOUT,
} as const;
