
import React, { useState, useCallback } from 'react';
import { AppView, Transaction } from './types';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Keypad from './components/Keypad';
// import TokenSelector from './components/TokenSelector'; // Commented out - USD1-only payment
import PaymentQR from './components/PaymentQR';
import History from './components/History';
import { useTransactions } from './hooks/useTransactions';
import { useBalance } from './hooks/useBalance';
import { MERCHANT_WALLET, SKIP_ONBOARDING } from './config/shadowwire';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>(AppView.DASHBOARD);
  const { transactions, addTransaction } = useTransactions();
  const { balance, onchainBalance, loading, refresh } = useBalance(MERCHANT_WALLET);
  const [pendingAmount, setPendingAmount] = useState<number>(0);
  const [selectedToken, setSelectedToken] = useState<string>('USD1');

  const handleConfirmAmount = (amount: number) => {
    setPendingAmount(amount);
    setSelectedToken('USD1'); // Explicitly set to USD1
    setView(AppView.PAYMENT_QR); // Skip TOKEN_SELECTION
  };

  // const handleTokenSelect = (token: string) => {
  //   setSelectedToken(token);
  //   setView(AppView.PAYMENT_QR);
  // };

  const handlePaymentComplete = useCallback(() => {
    const newTx: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      amount: pendingAmount,
      currency: 'USD',
      status: 'completed',
      timestamp: new Date(),
      cryptoType: selectedToken
    };
    addTransaction(newTx);
    refresh(); // Trigger fast polling after payment
    setView(AppView.DASHBOARD);
    setPendingAmount(0);
  }, [pendingAmount, selectedToken, addTransaction, refresh]);
  const skipOnboarding = SKIP_ONBOARDING;
  const dontShowHeader = (view === AppView.DASHBOARD && (transactions.length === 0 && !skipOnboarding)) || view === AppView.KEYPAD || view === AppView.PAYMENT_QR || view === AppView.HISTORY;

  return (
    <div>
      <Layout showHeader={!dontShowHeader}>
        {view === AppView.DASHBOARD && (
          <Dashboard
            balance={balance}
            onchainBalance={onchainBalance}
            loading={loading}
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
        {/* TokenSelector removed - USD1-only payment */}
        {/* view === AppView.TOKEN_SELECTION && (
          <TokenSelector
            onSelect={handleTokenSelect}
            onBack={() => setView(AppView.KEYPAD)}
          />
        ) */}
        {view === AppView.PAYMENT_QR && (
          <PaymentQR
            amount={pendingAmount}
            token={selectedToken}
            onComplete={handlePaymentComplete}
            onBack={() => setView(AppView.KEYPAD)} // Changed from TOKEN_SELECTION
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
