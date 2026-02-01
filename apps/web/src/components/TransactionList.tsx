import type { Transaction } from '../types';

const typeLabels: Record<Transaction['type'], string> = {
  deposit: 'Deposit',
  withdraw: 'Withdraw',
  payment: 'Sent',
  received: 'Received',
};

const typeColors: Record<Transaction['type'], string> = {
  deposit: 'text-green-600',
  withdraw: 'text-red-500',
  payment: 'text-red-500',
  received: 'text-green-600',
};

interface Props {
  transactions: Transaction[];
  limit?: number;
}

export default function TransactionList({ transactions, limit }: Props) {
  const items = limit ? transactions.slice(0, limit) : transactions;

  if (items.length === 0) {
    return <p className="text-center text-gray-400 text-sm py-8">No transactions yet</p>;
  }

  return (
    <div className="space-y-1">
      {items.map(tx => (
        <div key={tx.id} className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors">
          <div>
            <p className="text-sm font-semibold text-black">{typeLabels[tx.type]}</p>
            <p className="text-[11px] text-gray-400">
              {new Date(tx.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
          <div className="text-right">
            <p className={`text-sm font-bold ${typeColors[tx.type]}`}>
              {tx.type === 'deposit' || tx.type === 'received' ? '+' : '-'}${tx.amount.toFixed(3)}
            </p>
            <p className={`text-[10px] font-semibold uppercase ${tx.status === 'completed' ? 'text-gray-400' : tx.status === 'failed' ? 'text-red-400' : 'text-yellow-500'}`}>
              {tx.status}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
