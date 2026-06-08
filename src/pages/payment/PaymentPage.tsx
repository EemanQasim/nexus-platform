import React, { useState } from 'react';
import {
  DollarSign, ArrowUpRight, ArrowDownLeft, ArrowLeftRight,
  Clock, CheckCircle, XCircle, Wallet, TrendingUp, CreditCard, Send
} from 'lucide-react';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { useAuth } from '../../context/AuthContext';

type TxType = 'deposit' | 'withdraw' | 'transfer';
type TxStatus = 'completed' | 'pending' | 'failed';

interface Transaction {
  id: string;
  type: TxType;
  amount: number;
  sender: string;
  receiver: string;
  status: TxStatus;
  date: string;
  note?: string;
}

const initialTransactions: Transaction[] = [
  { id: 'tx1', type: 'deposit', amount: 50000, sender: 'Bank Account', receiver: 'Wallet', status: 'completed', date: '2026-05-20', note: 'Initial deposit' },
  { id: 'tx2', type: 'transfer', amount: 15000, sender: 'Michael Chen', receiver: 'Sarah Johnson', status: 'completed', date: '2026-05-22', note: 'Seed funding – TechWave AI' },
  { id: 'tx3', type: 'withdraw', amount: 5000, sender: 'Wallet', receiver: 'Bank Account', status: 'completed', date: '2026-05-24', note: 'Withdrawal' },
  { id: 'tx4', type: 'transfer', amount: 20000, sender: 'Alex Rivera', receiver: 'Sarah Johnson', status: 'pending', date: '2026-05-28', note: 'Series A tranche 1' },
  { id: 'tx5', type: 'deposit', amount: 10000, sender: 'Bank Account', receiver: 'Wallet', status: 'failed', date: '2026-05-29', note: 'Bank transfer failed' },
];

const fmt = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

export const PaymentPage: React.FC = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [activeTab, setActiveTab] = useState<TxType>('deposit');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [receiver, setReceiver] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const balance = transactions.filter(t => t.status === 'completed').reduce((acc, tx) => {
    if (tx.type === 'deposit') return acc + tx.amount;
    if (tx.type === 'withdraw') return acc - tx.amount;
    if (tx.type === 'transfer') {
      if (tx.receiver === user?.name) return acc + tx.amount;
      if (tx.sender === user?.name) return acc - tx.amount;
    }
    return acc;
  }, 0);

  const totalIn = transactions.filter(t => t.type === 'deposit' && t.status === 'completed').reduce((a, t) => a + t.amount, 0);
  const totalOut = transactions.filter(t => t.type === 'withdraw' && t.status === 'completed').reduce((a, t) => a + t.amount, 0);
  const pending = transactions.filter(t => t.status === 'pending').reduce((a, t) => a + t.amount, 0);

  const handleSubmit = async () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) return;
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    const newTx: Transaction = {
      id: `tx${Date.now()}`,
      type: activeTab,
      amount: Number(amount),
      sender: activeTab === 'deposit' ? 'Bank Account' : (user?.name || 'You'),
      receiver: activeTab === 'withdraw' ? 'Bank Account' : activeTab === 'transfer' ? receiver || 'Recipient' : 'Wallet',
      status: 'pending',
      date: new Date().toISOString().split('T')[0],
      note: note || undefined,
    };
    setTransactions(prev => [newTx, ...prev]);
    setAmount(''); setNote(''); setReceiver('');
    setSuccessMsg(`${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} of ${fmt(Number(amount))} submitted!`);
    setIsLoading(false);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const statusIcon = (s: TxStatus) => {
    if (s === 'completed') return <CheckCircle size={15} className="text-accent-500"/>;
    if (s === 'pending') return <Clock size={15} className="text-secondary-500"/>;
    return <XCircle size={15} className="text-error-500"/>;
  };

  const typeIcon = (t: TxType) => {
    if (t === 'deposit') return <ArrowDownLeft size={16} className="text-accent-600"/>;
    if (t === 'withdraw') return <ArrowUpRight size={16} className="text-error-600"/>;
    return <ArrowLeftRight size={16} className="text-primary-600"/>;
  };

  if (!user) return null;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-dark-900">Wallet & Payments</h1>
        <p className="text-dark-500">Manage your funds and track transactions</p>
      </div>

      {/* Balance card */}
      <div className="relative bg-gradient-to-br from-primary-700 via-primary-600 to-secondary-600 rounded-3xl p-6 text-white overflow-hidden shadow-xl">
        <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-white/5"></div>
        <div className="absolute -right-5 -bottom-10 w-52 h-52 rounded-full bg-white/5"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1">
            <Wallet size={18} className="text-primary-200" />
            <p className="text-primary-100 text-sm font-medium">Total Balance</p>
          </div>
          <h2 className="text-4xl font-bold mb-4">{fmt(balance)}</h2>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Total In', value: fmt(totalIn), icon: <ArrowDownLeft size={14}/>, color: 'text-accent-300' },
              { label: 'Total Out', value: fmt(totalOut), icon: <ArrowUpRight size={14}/>, color: 'text-error-300' },
              { label: 'Pending', value: fmt(pending), icon: <Clock size={14}/>, color: 'text-secondary-200' },
            ].map((s, i) => (
              <div key={i} className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
                <span className={`flex items-center gap-1 text-xs font-medium ${s.color} mb-1`}>{s.icon}{s.label}</span>
                <p className="text-white font-bold text-sm">{s.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick action card */}
      <Card>
        <CardBody>
          <div className="flex gap-2 bg-dark-100 p-1 rounded-xl mb-5 w-fit">
            {(['deposit', 'withdraw', 'transfer'] as const).map(t => (
              <button key={t} onClick={() => setActiveTab(t)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold capitalize transition-all ${
                  activeTab === t ? 'bg-white text-primary-700 shadow-sm' : 'text-dark-500 hover:text-dark-700'
                }`}>
                {t}
              </button>
            ))}
          </div>

          {successMsg && (
            <div className="mb-4 flex items-center gap-2 bg-accent-50 border border-accent-200 text-accent-700 px-4 py-3 rounded-xl text-sm font-semibold">
              <CheckCircle size={16}/> {successMsg}
            </div>
          )}

          <div className="max-w-sm space-y-4">
            <div>
              <label className="block text-sm font-semibold text-dark-700 mb-1.5">Amount (USD)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400 font-semibold">$</span>
                <input type="number" value={amount} onChange={e => setAmount(e.target.value)}
                  placeholder="0.00" min="0"
                  className="w-full pl-8 pr-4 py-2.5 border border-dark-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 font-semibold" />
              </div>
            </div>

            {activeTab === 'transfer' && (
              <div>
                <label className="block text-sm font-semibold text-dark-700 mb-1.5">Recipient</label>
                <input value={receiver} onChange={e => setReceiver(e.target.value)}
                  placeholder="Name or email"
                  className="w-full px-4 py-2.5 border border-dark-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-dark-700 mb-1.5">Note (optional)</label>
              <input value={note} onChange={e => setNote(e.target.value)}
                placeholder={activeTab === 'transfer' ? 'e.g. Seed funding tranche 1' : 'e.g. Monthly withdrawal'}
                className="w-full px-4 py-2.5 border border-dark-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>

            {/* Quick amounts */}
            <div className="flex gap-2">
              {[1000, 5000, 10000, 25000].map(a => (
                <button key={a} onClick={() => setAmount(String(a))}
                  className="flex-1 py-1.5 bg-primary-50 hover:bg-primary-100 text-primary-700 text-xs font-semibold rounded-lg transition-colors">
                  ${(a/1000).toFixed(0)}k
                </button>
              ))}
            </div>

            <Button fullWidth isLoading={isLoading} onClick={handleSubmit}
              leftIcon={activeTab === 'transfer' ? <Send size={15}/> : activeTab === 'deposit' ? <ArrowDownLeft size={15}/> : <ArrowUpRight size={15}/>}>
              {isLoading ? 'Processing...' : `Confirm ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}`}
            </Button>
          </div>
        </CardBody>
      </Card>

      {/* Transaction history */}
      <Card>
        <CardHeader>
          <h2 className="font-bold text-dark-900">Transaction History</h2>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-dark-100">
                {['Type', 'Amount', 'Sender', 'Receiver', 'Note', 'Date', 'Status'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-dark-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-50">
              {transactions.map(tx => (
                <tr key={tx.id} className="hover:bg-dark-50 transition-colors">
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-1.5">
                      {typeIcon(tx.type)}
                      <span className="capitalize font-medium text-dark-700">{tx.type}</span>
                    </span>
                  </td>
                  <td className={`px-4 py-3 font-bold ${tx.type === 'deposit' ? 'text-accent-600' : tx.type === 'withdraw' ? 'text-error-600' : 'text-primary-600'}`}>
                    {tx.type === 'deposit' ? '+' : tx.type === 'withdraw' ? '-' : '↔'}{fmt(tx.amount)}
                  </td>
                  <td className="px-4 py-3 text-dark-600">{tx.sender}</td>
                  <td className="px-4 py-3 text-dark-600">{tx.receiver}</td>
                  <td className="px-4 py-3 text-dark-400 max-w-[150px] truncate">{tx.note || '—'}</td>
                  <td className="px-4 py-3 text-dark-500">{tx.date}</td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-1">
                      {statusIcon(tx.status)}
                      <span className={`capitalize font-semibold ${
                        tx.status === 'completed' ? 'text-accent-600' :
                        tx.status === 'pending' ? 'text-secondary-600' : 'text-error-600'
                      }`}>{tx.status}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
