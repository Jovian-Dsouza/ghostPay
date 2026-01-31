import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '../contexts/WalletContext';
import { useBalance } from '../hooks/useBalance';
import { deposit } from '../services/shadowWireService';
import AmountInput from '../components/AmountInput';
import type { Transaction } from '../types';

function saveTx(tx: Transaction) {
  const txs: Transaction[] = JSON.parse(localStorage.getItem('gp_txs') || '[]');
  txs.unshift(tx);
  localStorage.setItem('gp_txs', JSON.stringify(txs));
}

export default function DepositPage() {
  const { address } = useWallet();
  const { balance } = useBalance(address);
  const navigate = useNavigate();
  const [status, setStatus] = useState<'input' | 'loading' | 'success' | 'error'>('input');
  const [error, setError] = useState('');

  const handleConfirm = async (amount: number) => {
    if (!address) return;
    setStatus('loading');
    try {
      await deposit(address, amount);
      saveTx({
        id: crypto.randomUUID(),
        type: 'deposit',
        amount,
        status: 'completed',
        timestamp: new Date().toISOString(),
      });
      setStatus('success');
      setTimeout(() => navigate('/'), 1500);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Deposit failed');
      setStatus('error');
    }
  };

  if (status === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-semibold">Processing deposit...</p>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <div className="bg-black p-4 rounded-full">
          <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="text-sm font-black uppercase tracking-widest">Deposit Complete</p>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 px-6">
        <div className="bg-red-500 p-4 rounded-full">
          <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <p className="text-sm font-semibold text-red-500">{error}</p>
        <button onClick={() => setStatus('input')} className="text-xs font-black uppercase tracking-widest border-b-2 border-black pb-0.5">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="text-center pt-4">
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
          ShadowWire balance: ${balance.toFixed(2)}
        </p>
      </div>
      <AmountInput onConfirm={handleConfirm} onCancel={() => navigate('/')} confirmLabel="Deposit" />
    </div>
  );
}
