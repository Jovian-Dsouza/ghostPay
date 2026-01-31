import { ShadowWireClient, type TokenSymbol } from '@radr/shadowwire';

let client: ShadowWireClient | null = null;

function getClient(): ShadowWireClient {
  if (!client) {
    client = new ShadowWireClient();
  }
  return client;
}

export async function getBalance(wallet: string): Promise<number> {
  const sw = getClient();
  const balance = await sw.getBalance(wallet, 'USD1' as TokenSymbol);
  return balance.available || 0;
}

export async function deposit(wallet: string, amount: number): Promise<void> {
  const sw = getClient();
  await sw.deposit(wallet, amount, 'USD1' as TokenSymbol);
}

export async function withdraw(wallet: string, amount: number): Promise<void> {
  const sw = getClient();
  await sw.withdraw(wallet, amount, 'USD1' as TokenSymbol);
}

export async function transfer(from: string, to: string, amount: number): Promise<void> {
  const sw = getClient();
  await sw.transfer(from, to, amount, 'USD1' as TokenSymbol);
}
