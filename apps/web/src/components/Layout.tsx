import type { ReactNode } from 'react';
import BottomNav from './BottomNav';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col h-[100dvh] max-w-md mx-auto bg-white">
      <div className="flex-1 overflow-y-auto">{children}</div>
      <BottomNav />
    </div>
  );
}
