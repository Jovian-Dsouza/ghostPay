import { USD1_LOGO_URL } from '../types';

interface Props {
  balance: number;
  onchainBalance: number;
  loading: boolean;
}

export default function BalanceCard({ balance, onchainBalance, loading }: Props) {
  return (
    <div className="text-center py-8">

      <h1 className="text-5xl font-black tracking-tighter text-black">
        {loading ? (
          <span className="inline-block w-32 h-12 bg-gray-100 rounded-lg animate-pulse" />
        ) : (
          `$${(Math.floor(balance * 1000) / 1000).toFixed(3)}`
        )}
      </h1>
      <div className="flex items-center justify-center gap-2 mb-1">
        <p className="text-sm text-gray-400 mt-1 font-medium">USD1</p>
        <img src={USD1_LOGO_URL} alt="USD1" className="w-5 h-5 rounded-full" />
      </div>

      {!loading && (
        <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-50">
          <div className={`w-1.5 h-1.5 rounded-full ${onchainBalance > 0 ? 'bg-emerald-400' : 'bg-gray-300'}`} />
          <span className="text-xs font-semibold text-gray-500">
            ${(Math.floor(onchainBalance * 1000) / 1000).toFixed(3)} on-chain
          </span>
        </div>
      )}
    </div>
  );
}
