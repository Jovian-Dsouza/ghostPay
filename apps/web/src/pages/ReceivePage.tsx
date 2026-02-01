import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '../contexts/WalletContext';
import { usePayment } from '../hooks/usePayment';
import QRDisplay from '../components/QRDisplay';
import type { Transaction } from '../types';

function saveTx(tx: Transaction) {
  const txs: Transaction[] = JSON.parse(localStorage.getItem('gp_txs') || '[]');
  txs.unshift(tx);
  localStorage.setItem('gp_txs', JSON.stringify(txs));
}

export default function ReceivePage() {
  const { address } = useWallet();
  const navigate = useNavigate();
  const { session, timeRemaining, startReceive, cancel } = usePayment(address);
  const [amount, setAmount] = useState('');
  const [showQR, setShowQR] = useState(false);
  const savedRef = useRef(false);

  useEffect(() => {
    if (session?.status === 'completed' && !savedRef.current) {
      savedRef.current = true;
      saveTx({
        id: crypto.randomUUID(),
        type: 'received',
        amount: session.amount,
        status: 'completed',
        timestamp: new Date().toISOString(),
      });
      setTimeout(() => navigate('/'), 2000);
    }
  }, [session?.status, session?.amount, navigate]);

  const handleGenerate = () => {
    const amt = parseFloat(amount) || 0;
    if (amt <= 0) return;
    setShowQR(true);
    startReceive(amt);
  };

  if (session?.status === 'completed') {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <div className="bg-black p-4 rounded-full">
          <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="text-sm font-black uppercase tracking-widest">Payment Received</p>
        <p className="text-lg font-black tracking-tight">${session.received.toFixed(3)}</p>
        {session.fee > 0 && (
          <p className="text-xs text-gray-400 mt-1">Fee: ${session.fee.toFixed(3)}</p>
        )}
      </div>
    );
  }

  if (showQR && address) {
    const amt = parseFloat(amount) || 0;
    const minutes = Math.floor(timeRemaining / 60000);
    const seconds = Math.floor((timeRemaining % 60000) / 1000);

    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 px-4">
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
          Requesting ${amt.toFixed(3)}
        </p>
        <QRDisplay wallet={address} amount={amt} />
        {session?.status === 'waiting' && (
          <>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-black rounded-full animate-pulse" />
              <p className="text-xs font-bold">Waiting for payment...</p>
            </div>
            <p className="text-[10px] text-gray-400 font-mono">{minutes}:{String(seconds).padStart(2, '0')}</p>
          </>
        )}
        {session?.status === 'verifying' && (
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-black rounded-full animate-ping" />
            <p className="text-xs font-bold">Verifying payment...</p>
          </div>
        )}
        {session?.status === 'expired' && (
          <p className="text-xs font-bold text-red-500">Session expired</p>
        )}
        <button onClick={() => { cancel(); setShowQR(false); }} className="text-xs font-black uppercase tracking-widest text-gray-400">
          Back
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-full gap-6 px-6">
      <div className="text-center">
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-4">Receive Payment</p>
        <input
          type="number"
          inputMode="decimal"
          placeholder="Amount"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          className="w-full text-center text-3xl font-black tracking-tighter text-black bg-transparent border-b-2 border-gray-200 focus:border-black outline-none pb-2 transition-colors"
        />
        <p className="text-xs text-gray-400 mt-2">Enter the amount to receive</p>
      </div>
      <button
        onClick={handleGenerate}
        disabled={!amount || parseFloat(amount) <= 0}
        className="w-full py-4 bg-black text-white text-xs font-black rounded-full active:scale-95 transition-all uppercase tracking-widest disabled:opacity-30 disabled:active:scale-100"
      >
        Show QR Code
      </button>
      <button onClick={() => navigate('/')} className="text-xs font-black uppercase tracking-widest text-gray-400">
        Cancel
      </button>
    </div>
  );
}
