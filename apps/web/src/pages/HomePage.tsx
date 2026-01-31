import { useNavigate } from 'react-router-dom';
import { useWallet } from '../contexts/WalletContext';
import { useBalance } from '../hooks/useBalance';
import BalanceCard from '../components/BalanceCard';
import TransactionList from '../components/TransactionList';
import type { Transaction } from '../types';

function getTransactions(): Transaction[] {
  try {
    return JSON.parse(localStorage.getItem('gp_txs') || '[]');
  } catch { return []; }
}

const actions = [
  { label: 'Deposit', path: '/deposit', icon: 'M12 4v16m0-16l-4 4m4-4l4 4' },
  { label: 'Withdraw', path: '/withdraw', icon: 'M12 20V4m0 16l-4-4m4 4l4-4' },
  { label: 'Send', path: '/scan', icon: 'M12 19l9 2-9-18-9 18 9-2zm0 0v-8' },
  { label: 'Receive', path: '/receive', icon: 'M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4' },
];

export default function HomePage() {
  const { address } = useWallet();
  const { balance, loading } = useBalance(address);
  const navigate = useNavigate();
  const txs = getTransactions();

  return (
    <div className="px-4 pb-4">
      <BalanceCard balance={balance} loading={loading} />
      <div className="grid grid-cols-4 gap-2 mb-6">
        {actions.map(a => (
          <button key={a.path} onClick={() => navigate(a.path)} className="flex flex-col items-center gap-1.5 py-3 rounded-2xl bg-gray-50 active:bg-gray-100 transition-colors">
            <svg className="w-6 h-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d={a.icon} />
            </svg>
            <span className="text-[10px] font-bold text-black uppercase tracking-wider">{a.label}</span>
          </button>
        ))}
      </div>
      <div>
        <div className="flex items-center justify-between mb-2 px-1">
          <h3 className="text-xs font-black uppercase tracking-widest text-gray-400">Recent</h3>
          {txs.length > 0 && (
            <button onClick={() => navigate('/history')} className="text-xs font-bold text-gray-400">See all</button>
          )}
        </div>
        <TransactionList transactions={txs} limit={5} />
      </div>
    </div>
  );
}
