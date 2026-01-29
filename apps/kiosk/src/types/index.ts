
export * from './payment';

export enum AppView {
  DASHBOARD = 'DASHBOARD',
  KEYPAD = 'KEYPAD',
  TOKEN_SELECTION = 'TOKEN_SELECTION',
  PAYMENT_QR = 'PAYMENT_QR',
  HISTORY = 'HISTORY',
  SETTINGS = 'SETTINGS'
}

export interface Transaction {
  id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed';
  timestamp: Date;
  customerName?: string;
  cryptoType: string;
  tokenMint?: string;
}

export interface MerchantProfile {
  name: string;
  storeId: string;
  totalSales: number;
  currency: string;
}

export const TOKEN_MINTS: Record<string, string> = {
  USD1: 'USD1ttGY1N17NEEHLmELoaybftRBUSErhqYiQzvEmuB',
};

export const DEFAULT_TOKEN = 'USD1';
export const DEFAULT_TOKEN_MINT = TOKEN_MINTS.USD1;
export const USD1_LOGO_URL = 'https://s2.coinmarketcap.com/static/img/coins/64x64/36148.png';
