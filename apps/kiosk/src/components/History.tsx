
import React from 'react';
import { Transaction } from '../types';
import { USD1_LOGO_URL } from '../types';

interface HistoryProps {
  transactions: Transaction[];
}

const History: React.FC<HistoryProps> = ({ transactions }) => {
  return (
    <div className="pt-3 pb-3 px-4 h-full overflow-y-auto animate-in slide-in-from-right-10 duration-300">
      <h2 className="text-[12px] font-black uppercase tracking-[0.2em] text-black mb-4 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Transaction Log
      </h2>
      <div className="space-y-2 pb-4">
        {transactions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-[#8A8A8F] text-[11px] font-black uppercase tracking-widest">No history yet</p>
          </div>
        ) : (
          transactions.map((tx) => (
            <div key={tx.id} className="py-2.5 px-3 flex items-center justify-between bg-[#F7F7F8] rounded-2xl border border-transparent active:bg-[#E9E9E9] transition-all">
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  {tx.cryptoType === 'USD1' ? (
                    <div className="flex items-center gap-1 px-1.5 py-0.5 bg-black text-white text-[9px] font-black rounded-md">
                      <img src={USD1_LOGO_URL} alt="USD1" className="w-3 h-3 rounded-full" />
                      <span>{tx.cryptoType}</span>
                    </div>
                  ) : (
                    <span className="px-1.5 py-0.5 bg-black text-white text-[9px] font-black rounded-md">
                      {tx.cryptoType}
                    </span>
                  )}
                  <span className="text-[13px] font-black text-black tracking-tight">Payment</span>
                </div>
                <p className="text-[10px] text-[#8A8A8F] font-bold mt-0.5">{tx.timestamp.toLocaleDateString()} • {tx.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
              </div>
              <div className="text-right">
                <span className="text-[14px] font-black text-black">${tx.amount.toFixed(2)}</span>
                <div className={`text-[9px] font-black uppercase tracking-tighter mt-0 ${tx.status === 'completed' ? 'text-black opacity-30' : 'text-[#8A8A8F]'}`}>
                  {tx.status}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default History;
