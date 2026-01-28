
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="relative w-[300px] h-[440px] bg-white text-black overflow-hidden flex flex-col">
      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden px-4">
        {children}
      </div>
    </div>
  );
};

export default Layout;
