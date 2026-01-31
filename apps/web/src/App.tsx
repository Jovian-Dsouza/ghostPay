import { Routes, Route } from 'react-router-dom';
import { useWallet } from './contexts/WalletContext';
import Layout from './components/Layout';
import ConnectWallet from './components/ConnectWallet';
import HomePage from './pages/HomePage';
import DepositPage from './pages/DepositPage';
import WithdrawPage from './pages/WithdrawPage';
import ScanPage from './pages/ScanPage';
import ReceivePage from './pages/ReceivePage';
import HistoryPage from './pages/HistoryPage';

export default function App() {
  const { isConnected } = useWallet();

  if (!isConnected) {
    return (
      <div className="h-[100dvh] max-w-md mx-auto bg-white">
        <ConnectWallet />
      </div>
    );
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/deposit" element={<DepositPage />} />
        <Route path="/withdraw" element={<WithdrawPage />} />
        <Route path="/scan" element={<ScanPage />} />
        <Route path="/receive" element={<ReceivePage />} />
        <Route path="/history" element={<HistoryPage />} />
      </Routes>
    </Layout>
  );
}
