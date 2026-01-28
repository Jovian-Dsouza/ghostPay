
import React from 'react';
import { Transaction } from '../types';

interface DashboardProps {
  transactions: Transaction[];
  onStartPayment: () => void;
}

const GhostIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 64 64" fill="none" className={className}>
    <path
      d="M32 4C18.7 4 8 14.7 8 28v28c0 2.2 2.6 3.4 4.3 2l6.7-5.3 6.7 5.3c1.3 1 3 1 4.3 0l6-4.8 6 4.8c1.3 1 3 1 4.3 0l6.7-5.3 6.7 5.3c1.7 1.4 4.3.2 4.3-2V28C56 14.7 45.3 4 32 4z"
      fill="currentColor"
    />
    <circle cx="24" cy="28" r="4" fill="white" />
    <circle cx="40" cy="28" r="4" fill="white" />
    <circle cx="25" cy="27" r="1.5" fill="black" />
    <circle cx="41" cy="27" r="1.5" fill="black" />
  </svg>
);

const Dashboard: React.FC<DashboardProps> = ({ transactions, onStartPayment }) => {
  const totalBalance = transactions
    .filter(t => t.status === 'completed')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const hasTransactions = transactions.length > 0;

  if (!hasTransactions) {
    return (
      <div className="h-full flex flex-col items-center justify-center relative overflow-hidden animate-in fade-in duration-500">
        {/* Background decorative elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 left-4 w-20 h-20 rounded-full bg-gradient-to-br from-violet-200 to-fuchsia-200 opacity-60 blur-xl animate-pulse-ring" />
          <div className="absolute bottom-20 right-4 w-24 h-24 rounded-full bg-gradient-to-br from-cyan-200 to-blue-200 opacity-50 blur-xl animate-pulse-ring" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/3 right-8 w-12 h-12 rounded-full bg-gradient-to-br from-amber-200 to-orange-200 opacity-40 blur-lg animate-pulse-ring" style={{ animationDelay: '2s' }} />
        </div>

        {/* Ghost mascot */}
        <div className="relative mb-6">
          <div className="absolute inset-0 scale-110 blur-2xl opacity-20 bg-gradient-to-b from-black to-transparent rounded-full" />
          <GhostIcon className="w-20 h-20 text-black animate-float drop-shadow-lg" />
        </div>

        {/* Welcome text */}
        <div className="text-center relative z-10 px-6">
          <h2 className="text-[22px] font-black text-black mb-1 tracking-tight">
            Ready to receive
          </h2>
          <p className="text-[13px] text-[#8A8A8F] font-medium mb-6 leading-relaxed">
            Accept crypto payments privately.<br/>
            Your first sale is just a tap away.
          </p>
        </div>

        {/* CTA Button with shimmer */}
        <button
          onClick={onStartPayment}
          className="relative px-8 py-3.5 bg-black text-white rounded-2xl text-[15px] font-black uppercase tracking-wider active:scale-95 transition-all duration-200 shadow-lg shadow-black/20 hover:shadow-xl hover:shadow-black/30 overflow-hidden group"
        >
          <span className="relative z-10">Start Payment</span>
          <div className="absolute inset-0 animate-shimmer opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>

        {/* Subtle hint */}
        <p className="mt-6 text-[10px] text-[#C4C4C6] font-medium tracking-wide">
          Powered by Solana
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 pt-4 pb-2 animate-in fade-in duration-500">
      {/* Balance Display */}
      <div className="text-center pt-2">
        <p className="text-[#8A8A8F] text-[11px] font-bold tracking-[0.15em] uppercase mb-0.5">Total Revenue</p>
        <div className="flex items-center justify-center">
           <h1 className="text-[44px] font-black leading-tight tracking-tighter text-black">
            <span className="text-[32px] align-top mr-0.5 opacity-30 font-bold">$</span>
            {Math.floor(totalBalance)}
            <span className="text-[32px] opacity-50">.{(totalBalance % 1).toFixed(2).split('.')[1]}</span>
          </h1>
        </div>

        <button
          onClick={onStartPayment}
          className="mt-3.5 mx-auto px-5 py-2 bg-black text-white rounded-full text-[14px] font-black uppercase tracking-widest active:scale-95 transition-transform shadow-md shadow-black/20"
        >
          New Payment
        </button>
      </div>

      {/* Recent Activity Section */}
      <div className="pt-2">
        <div className="flex justify-between items-baseline mb-2">
          <h3 className="text-[12px] font-black text-black uppercase tracking-wider">Activity</h3>
          <span className="text-[10px] text-[#8A8A8F] font-bold uppercase cursor-pointer tracking-wide hover:text-black transition-colors">See all</span>
        </div>

        <div className="space-y-1.5">
          {transactions.slice(0, 4).map((tx, index) => (
            <div
              key={tx.id}
              className="py-2.5 px-3 flex items-center justify-between bg-[#F7F7F8] rounded-2xl hover:bg-[#EFEFEF] transition-all duration-200 border border-transparent active:border-black/5 active:scale-[0.98]"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="px-1.5 py-0.5 bg-black text-white text-[9px] font-black rounded-md">{tx.cryptoType}</span>
                  <span className="text-[13px] font-black text-black tracking-tight">Received</span>
                </div>
                <span className="text-[11px] text-[#8A8A8F] font-medium mt-0.5">
                  {tx.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[14px] font-black text-black">
                  ${tx.amount.toFixed(2)}
                </span>
                <div className={`text-[9px] font-black uppercase tracking-tighter mt-0 ${tx.status === 'completed' ? 'text-emerald-500' : tx.status === 'failed' ? 'text-red-400' : 'text-[#8A8A8F]'}`}>
                  {tx.status === 'completed' ? '✓ ' : ''}{tx.status}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
