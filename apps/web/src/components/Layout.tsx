import type { ReactNode } from 'react';
import { useAppKit } from '@reown/appkit/react';
import { useWallet } from '../contexts/WalletContext';
import BottomNav from './BottomNav';

export default function Layout({ children }: { children: ReactNode }) {
  const { open } = useAppKit();
  const { address } = useWallet();

  return (
    <div className="flex flex-col h-[100dvh] max-w-md mx-auto bg-white">
      <header className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="ghostPay" className="w-10 h-10" />
          <span className="text-lg font-black tracking-tighter text-black">ghostPay</span>
        </div>
        <button
          onClick={() => open({ view: 'Account' })}
          className="px-3 py-1.5 bg-black text-white text-[10px] font-bold rounded-full uppercase tracking-wider active:scale-95 transition-transform"
        >
          {address ? `${address.slice(0, 4)}...${address.slice(-4)}` : 'Wallet'}
        </button>
      </header>
      <div className="flex-1 overflow-y-auto">{children}</div>
      <BottomNav />
    </div>
  );
}
