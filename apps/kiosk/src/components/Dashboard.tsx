
import React from 'react';
import { Transaction } from '../types';

interface DashboardProps {
  transactions: Transaction[];
  onStartPayment: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ transactions, onStartPayment }) => {
  const totalBalance = transactions
    .filter(t => t.status === 'completed')
    .reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="space-y-4 pt-4 pb-2 animate-in fade-in duration-500">
      {/* Mibu Style Balance Display - Compact */}
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
          className="mt-3.5 mx-auto px-5 py-2 bg-black text-white rounded-full text-[14px] font-black uppercase tracking-widest active:scale-95 transition-transform mibu-shadow"
        >
          New Payment
        </button>
      </div>

      {/* Recent Activity Section */}
      <div className="pt-2">
        <div className="flex justify-between items-baseline mb-2">
          <h3 className="text-[12px] font-black text-black uppercase tracking-wider">Activity</h3>
          <span className="text-[10px] text-[#8A8A8F] font-bold uppercase cursor-pointer tracking-wide">See all</span>
        </div>

        <div className="space-y-1.5">
          {transactions.length === 0 ? (
            <p className="text-center text-[#8A8A8F] text-[11px] py-6 font-medium">No activity yet</p>
          ) : (
            transactions.slice(0, 4).map((tx) => (
              <div key={tx.id} className="py-2.5 px-3 flex items-center justify-between bg-[#F7F7F8] rounded-2xl hover:bg-[#E9E9E9] transition-colors border border-transparent active:border-black/5">
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
                  <div className={`text-[9px] font-black uppercase tracking-tighter mt-0 ${tx.status === 'completed' ? 'text-black opacity-30' : 'text-[#8A8A8F]'}`}>
                    {tx.status}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
