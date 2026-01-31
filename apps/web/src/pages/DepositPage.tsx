import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '../contexts/WalletContext';
import { useBalance } from '../hooks/useBalance';
import { deposit } from '../services/shadowWireService';
import { signAndSendTransaction } from '../services/transactionService';
import AmountInput from '../components/AmountInput';
import type { Transaction } from '../types';
import { parseErrorMessage } from '../utils/parseError';

function saveTx(tx: Transaction) {
  const txs: Transaction[] = JSON.parse(localStorage.getItem('gp_txs') || '[]');
  txs.unshift(tx);
  localStorage.setItem('gp_txs', JSON.stringify(txs));
}

export default function DepositPage() {
  const { address, walletProvider, connection } = useWallet();
  const { balance, onchainBalance, refresh } = useBalance(address);
  const navigate = useNavigate();
  const [status, setStatus] = useState<'input' | 'loading' | 'success' | 'error'>('input');
  const [error, setError] = useState('');

  const handleConfirm = async (amount: number) => {
    if (!address || !walletProvider || !connection) return;
    setStatus('loading');
    try {
      const response = await deposit(address, amount);
      await signAndSendTransaction(response.unsigned_tx_base64, walletProvider, connection);
      refresh();
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
      const raw = e instanceof Error ? e.message : 'Deposit failed';
      setError(parseErrorMessage(raw));
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
      <div className="flex flex-col items-center justify-center h-full gap-5 px-8">
        <div className="bg-red-50 p-5 rounded-2xl">
          <div className="bg-red-500 p-3 rounded-full">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        </div>
        <div className="text-center">
          <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Deposit Failed</p>
          <p className="text-sm font-semibold text-gray-700 leading-relaxed max-w-[260px]">{error}</p>
        </div>
        <button onClick={() => setStatus('input')} className="mt-2 text-xs font-black uppercase tracking-widest border-b-2 border-black pb-0.5">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-center gap-3 pt-4 px-4">
        <div className="flex-1 rounded-xl bg-gray-50 py-2.5 px-3 text-center">
          <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">ShadowWire</p>
          <p className="text-sm font-black text-black mt-0.5">${balance.toFixed(2)}</p>
        </div>
        <div className="flex-1 rounded-xl bg-gray-50 py-2.5 px-3 text-center">
          <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">On-chain</p>
          <p className="text-sm font-black text-black mt-0.5">${onchainBalance.toFixed(2)}</p>
        </div>
      </div>
      <AmountInput onConfirm={handleConfirm} onCancel={() => navigate('/')} confirmLabel="Deposit" />
    </div>
  );
}
