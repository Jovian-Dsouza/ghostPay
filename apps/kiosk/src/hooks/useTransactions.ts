import { useState, useEffect, useCallback } from 'react';
import { Transaction } from '../types';
import * as transactionService from '../services/transactionService';

interface UseTransactionsResult {
  transactions: Transaction[];
  loading: boolean;
  error: Error | null;
  addTransaction: (tx: Transaction) => Promise<void>;
  removeTransaction: (id: string) => Promise<void>;
}

export function useTransactions(): UseTransactionsResult {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    transactionService
      .loadTransactions()
      .then(setTransactions)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  const addTransaction = useCallback(async (tx: Transaction) => {
    await transactionService.saveTransaction(tx);
    setTransactions((prev) => [tx, ...prev]);
  }, []);

  const removeTransaction = useCallback(async (id: string) => {
    await transactionService.deleteTransaction(id);
    setTransactions((prev) => prev.filter((tx) => tx.id !== id));
  }, []);

  return { transactions, loading, error, addTransaction, removeTransaction };
}
