import { ShadowWireClient } from '@radr/shadowwire';
import { DEFAULT_TOKEN_MINT } from '../types';

let client: ShadowWireClient | null = null;

function getClient(): ShadowWireClient {
  if (!client) {
    client = new ShadowWireClient();
  }
  return client;
}

export async function getBalance(wallet: string): Promise<number> {
  const sw = getClient();
  const balance = await sw.getBalance(wallet, 'USD1');
  return balance.available || 0;
}

export async function deposit(wallet: string, amount: number): Promise<void> {
  const sw = getClient();
  await sw.deposit({ wallet, amount, token_mint: DEFAULT_TOKEN_MINT });
}

export async function withdraw(wallet: string, amount: number): Promise<void> {
  const sw = getClient();
  await sw.withdraw({ wallet, amount, token_mint: DEFAULT_TOKEN_MINT });
}

export async function transfer(from: string, to: string, amount: number): Promise<void> {
  const sw = getClient();
  await sw.transfer({ sender: from, recipient: to, amount, token: 'USD1', type: 'internal' });
}
