import { Transaction, type Connection } from '@solana/web3.js';
import type { Provider } from '@reown/appkit-adapter-solana/react';

export async function signAndSendTransaction(
  unsignedTxBase64: string,
  walletProvider: Provider,
  connection: Connection,
): Promise<string> {
  const txBuffer = Buffer.from(unsignedTxBase64, 'base64');
  const transaction = Transaction.from(txBuffer);

  const signature = await walletProvider.sendTransaction(transaction, connection);

  const latestBlockhash = await connection.getLatestBlockhash();
  await connection.confirmTransaction(
    { signature, ...latestBlockhash },
    'confirmed',
  );

  return signature;
}
