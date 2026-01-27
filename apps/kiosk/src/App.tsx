
import React, { useState, useCallback } from 'react';
import { AppView, Transaction } from './types';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Keypad from './components/Keypad';
import TokenSelector from './components/TokenSelector';
import PaymentQR from './components/PaymentQR';
import History from './components/History';

const INITIAL_TRANSACTIONS: Transaction[] = [
  { id: '1', amount: 42.50, currency: 'USD', status: 'completed', timestamp: new Date(Date.now() - 3600000), cryptoType: 'BTC' },
  { id: '2', amount: 15.00, currency: 'USD', status: 'completed', timestamp: new Date(Date.now() - 7200000), cryptoType: 'ETH' },
  { id: '3', amount: 124.99, currency: 'USD', status: 'failed', timestamp: new Date(Date.now() - 86400000), cryptoType: 'SOL' },
];

const App: React.FC = () => {
  const [view, setView] = useState<AppView>(AppView.DASHBOARD);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [pendingAmount, setPendingAmount] = useState<number>(0);
  const [selectedToken, setSelectedToken] = useState<string>('SOL');

  const handleConfirmAmount = (amount: number) => {
    setPendingAmount(amount);
    setView(AppView.TOKEN_SELECTION);
  };

  const handleTokenSelect = (token: string) => {
    setSelectedToken(token);
    setView(AppView.PAYMENT_QR);
  };

  const handlePaymentComplete = useCallback(() => {
    const newTx: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      amount: pendingAmount,
      currency: 'USD',
      status: 'completed',
      timestamp: new Date(),
      cryptoType: selectedToken
    };
    setTransactions(prev => [newTx, ...prev]);
    setView(AppView.DASHBOARD);
    setPendingAmount(0);
  }, [pendingAmount, selectedToken]);

  return (
    <div>
      <Layout>
        {view === AppView.DASHBOARD && (
          <Dashboard
            transactions={transactions}
            onStartPayment={() => setView(AppView.KEYPAD)}
          />
        )}
        {view === AppView.KEYPAD && (
          <Keypad
            onConfirm={handleConfirmAmount}
            onCancel={() => setView(AppView.DASHBOARD)}
          />
        )}
        {view === AppView.TOKEN_SELECTION && (
          <TokenSelector
            onSelect={handleTokenSelect}
            onBack={() => setView(AppView.KEYPAD)}
          />
        )}
        {view === AppView.PAYMENT_QR && (
          <PaymentQR
            amount={pendingAmount}
            token={selectedToken}
            onComplete={handlePaymentComplete}
            onBack={() => setView(AppView.TOKEN_SELECTION)}
          />
        )}
        {view === AppView.HISTORY && (
          <History transactions={transactions} />
        )}
      </Layout>
    </div>
  );
};

export default App;
