import { useState } from 'react';

interface Props {
  onConfirm: (amount: number) => void;
  onCancel: () => void;
  confirmLabel?: string;
  maxAmount?: number;
}

export default function AmountInput({ onConfirm, onCancel, confirmLabel = 'Confirm', maxAmount }: Props) {
  const [value, setValue] = useState('0');

  const press = (key: string) => {
    if (key === '⌫') {
      setValue(v => v.length > 1 ? v.slice(0, -1) : '0');
      return;
    }
    setValue(v => {
      if (v === '0' && key !== '.') return key;
      if (key === '.' && v.includes('.')) return v;
      if (v.includes('.') && v.split('.')[1].length >= 2) return v;
      return v + key;
    });
  };

  const amount = parseFloat(value);
  const overMax = maxAmount !== undefined && amount > maxAmount;

  return (
    <div className="flex flex-col h-full">
      <div className="text-center pt-6 pb-2">
        <p className="text-gray-400 text-[10px] font-bold tracking-[0.2em] uppercase">Enter Amount</p>
        <div className="text-5xl font-black mt-1 flex items-center justify-center tracking-tighter text-black">
          <span className="text-xl mt-2 mr-1 opacity-30 font-bold">$</span>
          <span>{value}</span>
        </div>
        {overMax && (
          <p className="text-red-500 text-xs mt-1">Exceeds available balance</p>
        )}
      </div>
      <div className="grid grid-cols-3 gap-1.5 px-4 flex-1 items-center">
        {['1','2','3','4','5','6','7','8','9','.','0','⌫'].map(key => (
          <button
            key={key}
            onClick={() => press(key)}
            className="w-16 h-16 mx-auto bg-gray-50 rounded-full text-lg font-semibold active:bg-gray-200 transition-all flex items-center justify-center text-black active:scale-90"
          >
            {key === '⌫' ? (
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"/>
                <line x1="18" y1="9" x2="12" y2="15"/><line x1="12" y1="9" x2="18" y2="15"/>
              </svg>
            ) : key}
          </button>
        ))}
      </div>
      <div className="flex gap-2 px-4 pb-4">
        <button onClick={onCancel} className="flex-1 py-3.5 text-black text-xs font-black rounded-full border border-gray-200 active:bg-gray-50 uppercase tracking-widest">
          Cancel
        </button>
        <button
          onClick={() => onConfirm(amount)}
          disabled={amount <= 0 || overMax}
          className="flex-[2] py-3.5 bg-black text-white text-xs font-black rounded-full active:scale-95 transition-all disabled:opacity-20 uppercase tracking-widest"
        >
          {confirmLabel}
        </button>
      </div>
    </div>
  );
}
