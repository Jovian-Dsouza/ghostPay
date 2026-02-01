import React, { useEffect } from 'react';
import QRCode from 'react-qr-code';
import { usePayment } from '../hooks/usePayment';
import { TOKEN_MINTS, USD1_LOGO_URL } from '../types';

interface PaymentQRProps {
  amount: number;
  token: string;
  onComplete: () => void;
  onBack: () => void;
}

const PaymentQR: React.FC<PaymentQRProps> = ({ amount, token, onComplete, onBack }) => {
  const { session, timeRemaining, createPayment, cancelPayment } = usePayment();

  useEffect(() => {
    const tokenMint = TOKEN_MINTS[token] || 'Native';
    createPayment({ amount, token, tokenMint });

    return () => {
      cancelPayment();
    };
  }, [amount, token, createPayment, cancelPayment]);

  useEffect(() => {
    if (session?.status === 'completed') {
      const timer = setTimeout(() => onComplete(), 2000);
      return () => clearTimeout(timer);
    }
  }, [session?.status, onComplete]);

  const handleBack = () => {
    cancelPayment();
    onBack();
  };

  const formatTimeRemaining = (ms: number): string => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const status = session?.status || 'pending';
  const isSuccess = status === 'completed';
  const isExpired = status === 'expired';
  const isError = status === 'error';
  const isWaiting = status === 'waiting' || status === 'pending';
  const isVerifying = status === 'verifying';

  return (
    <div className="flex flex-col items-center justify-center h-full space-y-3 pt-2 pb-2 text-center animate-in zoom-in-95 duration-500 bg-white">
      <div className="space-y-1">
        <div className="flex items-center justify-center gap-2">
          <img src={USD1_LOGO_URL} alt="USD1" className="w-5 h-5 rounded-full" />
          <p className="text-[10px] text-[#8A8A8F] font-black uppercase tracking-[0.2em]">
            Paying with {token}
          </p>
        </div>
        <div className="flex flex-col items-center">
          <h2 className="text-[42px] font-black text-black leading-tight tracking-tighter">
            ${(Math.floor(amount * 1000) / 1000).toFixed(3)}
          </h2>
          <div className="px-3 py-1 bg-black text-white text-[10px] font-black rounded-full uppercase tracking-widest mt-1">
            Crypto secured
          </div>
        </div>
      </div>

      {/* QR Code - Mibu Style (Monochrome) */}
      <div className="relative group">
        <div className={`p-4 bg-white border border-[#E9E9E9] rounded-[2rem] transition-all duration-700 mibu-shadow ${isSuccess ? 'scale-90 opacity-10' : 'scale-100'}`}>
          <div className="w-28 h-28 bg-white flex items-center justify-center relative overflow-hidden">
            {session?.qrData ? (
              <QRCode
                value={session.qrData}
                size={112}
                bgColor="#FFFFFF"
                fgColor="#000000"
                level="M"
              />
            ) : (
              <div className="grid grid-cols-4 gap-1">
                {[...Array(16)].map((_, i) => (
                  <div key={i} className="w-6 h-6 bg-gray-200 animate-pulse"></div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Success Overlay */}
        {isSuccess && (
          <div className="absolute inset-0 flex items-center justify-center animate-in zoom-in-50 duration-300">
            <div className="bg-black p-4 rounded-full shadow-xl">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        )}

        {/* Expired/Error Overlay */}
        {(isExpired || isError) && (
          <div className="absolute inset-0 flex items-center justify-center animate-in zoom-in-50 duration-300">
            <div className="bg-red-500 p-4 rounded-full shadow-xl">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-center gap-2">
          {isWaiting && (
            <div className="w-1.5 h-1.5 bg-black rounded-full animate-pulse"></div>
          )}
          {isVerifying && (
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
          )}
          <p className="text-[11px] font-black uppercase tracking-[0.1em] text-black">
            {isWaiting && "Scan QR with wallet"}
            {isVerifying && "Confirming on chain"}
            {isSuccess && "Success"}
            {isExpired && "Session expired"}
            {isError && "Payment error"}
          </p>
        </div>
        <p className="text-[11px] text-[#8A8A8F] max-w-[200px] mx-auto font-medium leading-relaxed">
          {isSuccess && 'Transaction complete. Redirecting...'}
          {isExpired && 'Payment window expired. Please try again.'}
          {isError && (session?.errorMessage || 'An error occurred. Please try again.')}
          {(isWaiting || isVerifying) && `Transfer ${(Math.floor(amount * 1000) / 1000).toFixed(3)} ${token}  to the terminal address.`}
        </p>

        {/* Timeout countdown */}
        {isWaiting && (
          <p className="text-[10px] text-[#8A8A8F] font-mono">
            Expires in {formatTimeRemaining(timeRemaining)}
          </p>
        )}
      </div>

      {(isWaiting || isExpired || isError) && (
        <button
          onClick={handleBack}
          className="text-[10px] font-black text-black uppercase tracking-widest border-b-2 border-black pb-0.5 opacity-40 hover:opacity-100 transition-opacity"
        >
          Back
        </button>
      )}
    </div>
  );
};

export default PaymentQR;
