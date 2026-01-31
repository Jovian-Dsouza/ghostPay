import QRCode from 'react-qr-code';
import { DEFAULT_TOKEN_MINT } from '../types';

interface Props {
  wallet: string;
  amount?: number;
}

export default function QRDisplay({ wallet, amount }: Props) {
  const params = new URLSearchParams();
  if (amount && amount > 0) {
    params.set('amount', amount.toString());
  }
  params.set('spl-token', DEFAULT_TOKEN_MINT);
  params.set('label', 'ghostPay');

  const uri = `solana:${wallet}?${params.toString()}`;

  return (
    <div className="p-5 bg-white border border-gray-100 rounded-3xl shadow-sm">
      <QRCode value={uri} size={200} bgColor="#FFFFFF" fgColor="#000000" level="M" />
    </div>
  );
}
