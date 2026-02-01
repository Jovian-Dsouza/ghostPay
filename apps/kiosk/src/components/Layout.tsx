
import React from 'react';
import { MERCHANT_WALLET } from '../config/shadowwire';

interface LayoutProps {
  children: React.ReactNode;
  showHeader?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, showHeader = true }) => {
  return (
    <div className="relative w-[300px] h-[440px] bg-white text-black overflow-hidden flex flex-col">
      {/* Header */}
      {showHeader && (
        <header className="flex items-center justify-between px-3 py-2.5 border-b border-gray-100">
          <div className="flex items-center gap-1.5">
            <img src="/logo.png" alt="ghostPay" className="w-8 h-8" />
            <span className="text-sm font-black tracking-tighter text-black">ghostPay</span>
          </div>
          <div className="px-2 py-1 bg-black text-white text-[9px] font-bold rounded-full uppercase tracking-wider">
            {MERCHANT_WALLET ? `${MERCHANT_WALLET.slice(0, 4)}...${MERCHANT_WALLET.slice(-4)}` : 'Wallet'}
          </div>
        </header>
      )}
      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden px-4">
        {children}
      </div>
    </div>
  );
};

export default Layout;
