import { createContext, useContext, type ReactNode } from 'react';
import { createAppKit, useAppKitAccount } from '@reown/appkit/react';
import { SolanaAdapter } from '@reown/appkit-adapter-solana';
import { solana } from '@reown/appkit/networks';
import { REOWN_PROJECT_ID, REOWN_METADATA } from '../config/reown';

const solanaAdapter = new SolanaAdapter();

createAppKit({
  adapters: [solanaAdapter],
  networks: [solana],
  projectId: REOWN_PROJECT_ID,
  metadata: REOWN_METADATA,
  features: {
    analytics: false,
  },
});

interface WalletContextType {
  address: string | undefined;
  isConnected: boolean;
}

const WalletContext = createContext<WalletContextType>({
  address: undefined,
  isConnected: false,
});

export function WalletProvider({ children }: { children: ReactNode }) {
  const { address, isConnected } = useAppKitAccount();

  return (
    <WalletContext.Provider value={{ address, isConnected }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  return useContext(WalletContext);
}
