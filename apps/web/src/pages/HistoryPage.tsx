import { useState } from 'react';
import TransactionList from '../components/TransactionList';
import type { Transaction } from '../types';

type Filter = 'all' | Transaction['type'];

const filters: { value: Filter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'deposit', label: 'Deposits' },
  { value: 'withdraw', label: 'Withdrawals' },
  { value: 'payment', label: 'Sent' },
  { value: 'received', label: 'Received' },
];

function getTransactions(): Transaction[] {
  try {
    return JSON.parse(localStorage.getItem('gp_txs') || '[]');
  } catch { return []; }
}

export default function HistoryPage() {
  const [filter, setFilter] = useState<Filter>('all');
  const txs = getTransactions();
  const filtered = filter === 'all' ? txs : txs.filter(t => t.type === filter);

  return (
    <div className="px-4 pt-6 pb-4">
      <h2 className="text-lg font-black tracking-tight text-black mb-4">History</h2>
      <div className="flex gap-1.5 mb-4 overflow-x-auto pb-1">
        {filters.map(f => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-full whitespace-nowrap transition-colors ${
              filter === f.value ? 'bg-black text-white' : 'bg-gray-50 text-gray-500'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>
      <TransactionList transactions={filtered} />
    </div>
  );
}
