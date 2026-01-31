import { USD1_LOGO_URL } from '../types';

interface Props {
  balance: number;
  loading: boolean;
}

export default function BalanceCard({ balance, loading }: Props) {
  return (
    <div className="text-center py-8">
      <div className="flex items-center justify-center gap-2 mb-1">
        <img src={USD1_LOGO_URL} alt="USD1" className="w-5 h-5 rounded-full" />
        <span className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em]">ShadowWire Balance</span>
      </div>
      <h1 className="text-5xl font-black tracking-tighter text-black">
        {loading ? (
          <span className="inline-block w-32 h-12 bg-gray-100 rounded-lg animate-pulse" />
        ) : (
          `$${balance.toFixed(2)}`
        )}
      </h1>
      <p className="text-xs text-gray-400 mt-1 font-medium">USD1</p>
    </div>
  );
}
