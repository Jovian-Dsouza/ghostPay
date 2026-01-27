
import React, { useState } from 'react';
import { TOKEN_MINTS } from '../types';

interface TokenSelectorProps {
  onSelect: (token: string) => void;
  onBack: () => void;
}

const TokenSelector: React.FC<TokenSelectorProps> = ({ onSelect, onBack }) => {
  const [search, setSearch] = useState('');
  const tokens = Object.keys(TOKEN_MINTS).filter(t =>
    t.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col animate-in fade-in slide-in-from-right-5 duration-300">
      <div className="pt-4 pb-2">
        <h2 className="text-[12px] font-black uppercase tracking-[0.2em] text-black">Select Token</h2>
        <input
          type="text"
          placeholder="Search assets..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full mt-3 px-4 py-2 bg-[#F7F7F8] border border-transparent focus:border-black/10 rounded-xl text-xs font-semibold outline-none transition-all"
        />
      </div>

      <div className="flex-1 overflow-y-auto -mx-1 px-1 space-y-1 pb-2">
        {tokens.map((token) => (
          <button
            key={token}
            onClick={() => onSelect(token)}
            className="w-full flex items-center justify-between p-3.5 bg-white border border-[#E9E9E9] rounded-2xl active:bg-[#F7F7F8] active:scale-[0.98] transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-[10px] font-black text-white">
                {token.slice(0, 2)}
              </div>
              <span className="text-[14px] font-black text-black group-active:translate-x-1 transition-transform">{token}</span>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3" className="opacity-10">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        ))}
        {tokens.length === 0 && (
          <p className="text-center py-10 text-[11px] text-[#8A8A8F] font-bold uppercase tracking-widest">No assets found</p>
        )}
      </div>

      <div className="pb-2">
        <button
          onClick={onBack}
          className="w-full py-3 bg-transparent text-black text-[10px] font-black rounded-full border border-[#E9E9E9] active:bg-[#F7F7F8] transition-all uppercase tracking-widest"
        >
          Back to amount
        </button>
      </div>
    </div>
  );
};

export default TokenSelector;
