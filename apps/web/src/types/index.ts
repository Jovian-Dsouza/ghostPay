export interface Transaction {
  id: string;
  type: 'deposit' | 'withdraw' | 'payment' | 'received';
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  timestamp: string;
  counterparty?: string;
}

export const TOKEN_MINTS: Record<string, string> = {
  USD1: 'USD1ttGY1N17NEEHLmELoaybftRBUSErhqYiQzvEmuB',
};

export const DEFAULT_TOKEN = 'USD1';
export const DEFAULT_TOKEN_MINT = TOKEN_MINTS.USD1;
export const USD1_LOGO_URL = 'https://s2.coinmarketcap.com/static/img/coins/64x64/36148.png';

export type PaymentStatus = 'pending' | 'waiting' | 'verifying' | 'completed' | 'expired' | 'error';
