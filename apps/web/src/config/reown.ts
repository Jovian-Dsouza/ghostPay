export const REOWN_PROJECT_ID = import.meta.env.VITE_REOWN_PROJECT_ID || '';

export const REOWN_METADATA = {
  name: 'ghostPay',
  description: 'Private Solana payments',
  url: typeof window !== 'undefined' ? window.location.origin : '',
  icons: ['https://avatars.githubusercontent.com/u/179229932'],
};
