
import React from 'react';

interface KeypadProps {
  onConfirm: (amount: number) => void;
  onCancel: () => void;
}

const Keypad: React.FC<KeypadProps> = ({ onConfirm, onCancel }) => {
  const [amountStr, setAmountStr] = React.useState('0');

  const handlePress = (key: string) => {
    if (key === '⌫') {
      setAmountStr(prev => prev.length > 1 ? prev.slice(0, -1) : '0');
      return;
    }

    setAmountStr(prev => {
      if (prev === '0' && key !== '.') return key;
      if (key === '.' && prev.includes('.')) return prev;
      if (prev.includes('.') && prev.split('.')[1].length >= 2) return prev;
      return prev + key;
    });
  };

  return (
    <div className="h-full flex flex-col animate-in slide-in-from-bottom-5 duration-300">
      {/* Header Section - Further reduced spacing and size */}
      <div className="text-center pt-4 pb-2">
        <p className="text-[#8A8A8F] text-[10px] font-bold tracking-[0.2em] uppercase">Enter Amount</p>
        <div className="text-[48px] font-black mt-0.5 flex items-center justify-center tracking-tighter text-black leading-none">
          <span className="text-[20px] align-top mt-2 mr-1 opacity-30 font-bold">$</span>
          <span>{amountStr}</span>
        </div>
      </div>

      {/* Grid Section - Scaled down buttons to 64px and reduced gaps */}
      <div className="grid grid-cols-3 gap-1.5 px-1 mb-2 flex-1 items-center">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', '⌫'].map((key) => (
          <button
            key={key}
            onClick={() => handlePress(key)}
            className="w-[64px] h-[64px] mx-auto bg-[#F7F7F8] rounded-full text-lg font-semibold active:bg-[#E9E9E9] transition-all flex items-center justify-center text-black active:scale-90"
          >
            {key === '⌫' ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"/>
                <line x1="18" y1="9" x2="12" y2="15"/>
                <line x1="12" y1="9" x2="18" y2="15"/>
              </svg>
            ) : key}
          </button>
        ))}
      </div>

      {/* Action Buttons Section - Compact height */}
      <div className="flex gap-2 px-1 pb-2">
        <button
          onClick={onCancel}
          className="flex-1 py-3 bg-transparent text-black text-[10px] font-black rounded-full border border-[#E9E9E9] active:bg-[#F7F7F8] transition-all uppercase tracking-widest"
        >
          Cancel
        </button>
        <button
          onClick={() => onConfirm(parseFloat(amountStr))}
          disabled={parseFloat(amountStr) <= 0}
          className="flex-[2] py-3 bg-black text-white text-[10px] font-black rounded-full active:scale-95 transition-all disabled:opacity-20 mibu-shadow uppercase tracking-widest"
        >
          Generate QR
        </button>
      </div>
    </div>
  );
};

export default Keypad;
