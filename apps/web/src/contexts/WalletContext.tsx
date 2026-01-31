import { createContext, useContext, type ReactNode } from 'react';
import { createAppKit, useAppKitAccount, useAppKitProvider } from '@reown/appkit/react';
import { useAppKitConnection, type Provider } from '@reown/appkit-adapter-solana/react';
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
  walletProvider: Provider | undefined;
  connection: ReturnType<typeof useAppKitConnection>['connection'] | undefined;
}

const WalletContext = createContext<WalletContextType>({
  address: undefined,
  isConnected: false,
  walletProvider: undefined,
  connection: undefined,
});

export function WalletProvider({ children }: { children: ReactNode }) {
  const { address, isConnected } = useAppKitAccount();
  const { walletProvider } = useAppKitProvider<Provider>('solana');
  const { connection } = useAppKitConnection();

  return (
    <WalletContext.Provider value={{ address, isConnected, walletProvider, connection }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  return useContext(WalletContext);
}
