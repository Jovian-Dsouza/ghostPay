import { ShadowWireClient, TokenUtils, initWASM, type DepositResponse, type WithdrawResponse } from '@radr/shadowwire';
import { DEFAULT_TOKEN, DEFAULT_TOKEN_MINT } from '../types';

let client: ShadowWireClient | null = null;
let wasmReady: Promise<void> | null = null;

function ensureWASM(): Promise<void> {
  if (!wasmReady) {
    wasmReady = initWASM('/wasm/settler_wasm_bg.wasm');
  }
  return wasmReady;
}

async function getClient(): Promise<ShadowWireClient> {
  await ensureWASM();
  if (!client) {
    client = new ShadowWireClient();
  }
  return client;
}

export async function getBalance(wallet: string): Promise<number> {
  const sw = await getClient();
  const balance = await sw.getBalance(wallet, DEFAULT_TOKEN);
  return TokenUtils.fromSmallestUnit(balance.available || 0, DEFAULT_TOKEN);
}

export async function deposit(wallet: string, amount: number): Promise<DepositResponse> {
  const sw = await getClient();
  const smallestUnit = TokenUtils.toSmallestUnit(amount, DEFAULT_TOKEN);
  return sw.deposit({ wallet, amount: smallestUnit, token_mint: DEFAULT_TOKEN_MINT });
}

export async function withdraw(wallet: string, amount: number): Promise<WithdrawResponse> {
  const sw = await getClient();
  const smallestUnit = TokenUtils.toSmallestUnit(amount, DEFAULT_TOKEN);
  return sw.withdraw({ wallet, amount: smallestUnit, token_mint: DEFAULT_TOKEN_MINT });
}

// transfer() expects display amounts — the SDK converts to smallest units internally
export async function transfer(from: string, to: string, amount: number): Promise<void> {
  const sw = await getClient();
  await sw.transfer({ sender: from, recipient: to, amount, token: DEFAULT_TOKEN, type: 'internal' });
}

export async function getTransferFee(amount: number): Promise<number> {
  const sw = await getClient();
  const feePercent = sw.getFeePercentage(DEFAULT_TOKEN);
  return amount * feePercent;
}
