import { ShadowWireClient, TokenUtils, type DepositResponse, type WithdrawResponse } from '@radr/shadowwire';
import { DEFAULT_TOKEN, DEFAULT_TOKEN_MINT } from '../types';

let client: ShadowWireClient | null = null;

function getClient(): ShadowWireClient {
  if (!client) {
    client = new ShadowWireClient();
  }
  return client;
}

export async function getBalance(wallet: string): Promise<number> {
  const sw = getClient();
  const balance = await sw.getBalance(wallet, DEFAULT_TOKEN);
  return TokenUtils.fromSmallestUnit(balance.available || 0, DEFAULT_TOKEN);
}

export async function deposit(wallet: string, amount: number): Promise<DepositResponse> {
  const sw = getClient();
  const smallestUnit = TokenUtils.toSmallestUnit(amount, DEFAULT_TOKEN);
  return sw.deposit({ wallet, amount: smallestUnit, token_mint: DEFAULT_TOKEN_MINT });
}

export async function withdraw(wallet: string, amount: number): Promise<WithdrawResponse> {
  const sw = getClient();
  const smallestUnit = TokenUtils.toSmallestUnit(amount, DEFAULT_TOKEN);
  return sw.withdraw({ wallet, amount: smallestUnit, token_mint: DEFAULT_TOKEN_MINT });
}

export async function transfer(from: string, to: string, amount: number): Promise<void> {
  const sw = getClient();
  const smallestUnit = TokenUtils.toSmallestUnit(amount, DEFAULT_TOKEN);
  await sw.transfer({ sender: from, recipient: to, amount: smallestUnit, token: DEFAULT_TOKEN, type: 'internal' });
}
