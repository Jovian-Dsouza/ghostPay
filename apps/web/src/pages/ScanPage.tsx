import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '../contexts/WalletContext';
import { transfer } from '../services/shadowWireService';
import QRScanner from '../components/QRScanner';
import type { Transaction } from '../types';

function saveTx(tx: Transaction) {
  const txs: Transaction[] = JSON.parse(localStorage.getItem('gp_txs') || '[]');
  txs.unshift(tx);
  localStorage.setItem('gp_txs', JSON.stringify(txs));
}

interface ParsedQR {
  recipient: string;
  amount: number;
}

function parseSolanaPayURI(uri: string): ParsedQR | null {
  try {
    // solana:{recipient}?amount=...&spl-token=...
    const match = uri.match(/^solana:([^?]+)/);
    if (!match) return null;
    const recipient = match[1];
    const params = new URLSearchParams(uri.split('?')[1] || '');
    const amount = parseFloat(params.get('amount') || '0');
    if (!recipient || amount <= 0) return null;
    return { recipient, amount };
  } catch {
    return null;
  }
}

export default function ScanPage() {
  const { address } = useWallet();
  const navigate = useNavigate();
  const [parsed, setParsed] = useState<ParsedQR | null>(null);
  const [status, setStatus] = useState<'scan' | 'confirm' | 'loading' | 'success' | 'error'>('scan');
  const [error, setError] = useState('');

  const handleScan = useCallback((data: string) => {
    const result = parseSolanaPayURI(data);
    if (result) {
      setParsed(result);
      setStatus('confirm');
    }
  }, []);

  const handlePay = async () => {
    if (!address || !parsed) return;
    setStatus('loading');
    try {
      await transfer(address, parsed.recipient, parsed.amount);
      saveTx({
        id: crypto.randomUUID(),
        type: 'payment',
        amount: parsed.amount,
        status: 'completed',
        timestamp: new Date().toISOString(),
        counterparty: parsed.recipient,
      });
      setStatus('success');
      setTimeout(() => navigate('/'), 2000);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Payment failed');
      setStatus('error');
    }
  };

  if (status === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-semibold">Sending payment...</p>
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
        <p className="text-sm font-black uppercase tracking-widest">Payment Sent</p>
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
        <button onClick={() => { setStatus('scan'); setParsed(null); }} className="text-xs font-black uppercase tracking-widest border-b-2 border-black pb-0.5">
          Try Again
        </button>
      </div>
    );
  }

  if (status === 'confirm' && parsed) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-6 px-6">
        <div className="text-center">
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-2">Confirm Payment</p>
          <h2 className="text-5xl font-black tracking-tighter text-black">${parsed.amount.toFixed(2)}</h2>
          <p className="text-xs text-gray-400 mt-2 font-mono break-all">
            To: {parsed.recipient.slice(0, 8)}...{parsed.recipient.slice(-8)}
          </p>
        </div>
        <div className="flex gap-2 w-full">
          <button onClick={() => { setStatus('scan'); setParsed(null); }} className="flex-1 py-3.5 text-black text-xs font-black rounded-full border border-gray-200 uppercase tracking-widest">
            Cancel
          </button>
          <button onClick={handlePay} className="flex-[2] py-3.5 bg-black text-white text-xs font-black rounded-full active:scale-95 transition-all uppercase tracking-widest">
            Pay Now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-full gap-4 px-4">
      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Scan QR to Pay</p>
      <QRScanner onScan={handleScan} />
      <button onClick={() => navigate('/')} className="text-xs font-black uppercase tracking-widest text-gray-400">
        Cancel
      </button>
    </div>
  );
}
