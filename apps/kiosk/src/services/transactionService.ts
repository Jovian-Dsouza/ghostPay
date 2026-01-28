import { Transaction } from '../types';

interface TransactionDTO {
  id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed';
  timestamp: string;
  customerName?: string;
  cryptoType: string;
  tokenMint?: string;
}

function parseTransaction(dto: TransactionDTO): Transaction {
  return {
    ...dto,
    timestamp: new Date(dto.timestamp),
  };
}

export async function loadTransactions(): Promise<Transaction[]> {
  const result = await window.ipcRenderer.invoke('db:get-transactions');
  return (result as TransactionDTO[]).map(parseTransaction);
}

export async function saveTransaction(tx: Transaction): Promise<void> {
  await window.ipcRenderer.invoke('db:save-transaction', {
    ...tx,
    timestamp: tx.timestamp.toISOString(),
  });
}

export async function deleteTransaction(id: string): Promise<void> {
  await window.ipcRenderer.invoke('db:delete-transaction', id);
}
