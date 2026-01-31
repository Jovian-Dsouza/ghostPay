import { Connection, PublicKey } from '@solana/web3.js';
import { DEFAULT_TOKEN_MINT } from '../types';

const RPC_URL = import.meta.env.VITE_SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com';
const connection = new Connection(RPC_URL);
const TOKEN_MINT = new PublicKey(DEFAULT_TOKEN_MINT);
const TOKEN_PROGRAM_ID = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');

export async function getOnchainBalance(wallet: string): Promise<number> {
  const owner = new PublicKey(wallet);
  const accounts = await connection.getParsedTokenAccountsByOwner(owner, {
    programId: TOKEN_PROGRAM_ID,
  });

  for (const { account } of accounts.value) {
    const info = account.data.parsed?.info;
    if (info?.mint === TOKEN_MINT.toBase58()) {
      return info.tokenAmount?.uiAmount ?? 0;
    }
  }

  return 0;
}
