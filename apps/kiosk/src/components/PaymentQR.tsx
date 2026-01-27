
import React, { useEffect, useState } from 'react';

interface PaymentQRProps {
  amount: number;
  token: string;
  onComplete: () => void;
  onBack: () => void;
}

const PaymentQR: React.FC<PaymentQRProps> = ({ amount, token, onComplete, onBack }) => {
  const [status, setStatus] = useState<'waiting' | 'verifying' | 'success'>('waiting');

  useEffect(() => {
    // Simulate payment lifecycle
    const t1 = setTimeout(() => setStatus('verifying'), 4000);
    const t2 = setTimeout(() => setStatus('success'), 7000);
    const t3 = setTimeout(() => onComplete(), 9500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onComplete]);

  return (
    <div className="flex flex-col items-center justify-center h-full space-y-3 pt-2 pb-2 text-center animate-in zoom-in-95 duration-500 bg-white">
      <div className="space-y-1">
        <p className="text-[10px] text-[#8A8A8F] font-black uppercase tracking-[0.2em]">Paying with {token}</p>
        <div className="flex flex-col items-center">
            <h2 className="text-[42px] font-black text-black leading-tight tracking-tighter">${amount.toFixed(2)}</h2>
            <div className="px-3 py-1 bg-black text-white text-[10px] font-black rounded-full uppercase tracking-widest mt-1">
                Crypto secured
            </div>
        </div>
      </div>

      {/* QR Mockup - Mibu Style (Monochrome) */}
      <div className="relative group">
        <div className={`p-4 bg-white border border-[#E9E9E9] rounded-[2rem] transition-all duration-700 mibu-shadow ${status === 'success' ? 'scale-90 opacity-10' : 'scale-100'}`}>
          <div className="w-28 h-28 bg-white flex items-center justify-center relative overflow-hidden">
            <div className="grid grid-cols-4 gap-1">
                {[...Array(16)].map((_, i) => (
                    <div key={i} className={`w-6 h-6 ${Math.random() > 0.4 ? 'bg-black' : 'bg-transparent'}`}></div>
                ))}
            </div>
          </div>
        </div>

        {/* Success Overlay */}
        {status === 'success' && (
          <div className="absolute inset-0 flex items-center justify-center animate-in zoom-in-50 duration-300">
            <div className="bg-black p-4 rounded-full shadow-xl">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-center gap-2">
          {status !== 'success' && (
            <div className="w-1.5 h-1.5 bg-black rounded-full animate-pulse"></div>
          )}
          <p className="text-[11px] font-black uppercase tracking-[0.1em] text-black">
            {status === 'waiting' && "Scan QR with wallet"}
            {status === 'verifying' && "Confirming on chain"}
            {status === 'success' && "Success"}
          </p>
        </div>
        <p className="text-[11px] text-[#8A8A8F] max-w-[200px] mx-auto font-medium leading-relaxed">
          {status === 'success' ? 'Transaction complete. Redirecting...' : `Transfer ${token} equivalent of $${amount.toFixed(2)} to the terminal address.`}
        </p>
      </div>

      {status === 'waiting' && (
        <button
          onClick={onBack}
          className="text-[10px] font-black text-black uppercase tracking-widest border-b-2 border-black pb-0.5 opacity-40 hover:opacity-100 transition-opacity"
        >
          Back
        </button>
      )}
    </div>
  );
};

export default PaymentQR;
