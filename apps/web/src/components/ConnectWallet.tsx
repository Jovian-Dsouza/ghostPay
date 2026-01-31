import { useAppKit } from '@reown/appkit/react';

export default function ConnectWallet() {
  const { open } = useAppKit();

  return (
    <div className="flex flex-col items-center justify-center h-full gap-6 px-6">
      <div className="text-center">
        <img src="/ghostPayLogo.png" alt="ghostPay" className="w-24 h-24 mx-auto mb-4" />
        <h1 className="text-3xl font-black tracking-tighter text-black">ghostPay.</h1>
        <p className="text-gray-400 text-sm mt-2 font-medium leading-relaxed">
          Private payments on Solana.<br />Connect your wallet to start.
        </p>
      </div>
      <button
        onClick={() => open()}
        className="w-full py-4 bg-black text-white text-sm font-black rounded-full active:scale-95 transition-all uppercase tracking-widest"
      >
        Connect Wallet
      </button>
    </div>
  );
}
