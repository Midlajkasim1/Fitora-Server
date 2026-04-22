import React, { useState } from 'react';
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Clock, 
  IndianRupee, 
  AlertCircle,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { useTrainerWallet, useRequestPayout } from '../../../hooks/trainer/use-trainer-wallet';
import { GlobalLoader } from '../../../shared/GlobalLoader';
import { format } from 'date-fns';

const TrainerWalletPage = () => {
  const { data, isLoading } = useTrainerWallet();
  const { mutate: requestPayout, isPending } = useRequestPayout();
  const [payoutAmount, setPayoutAmount] = useState('');

  if (isLoading) return <GlobalLoader />;

  const handlePayoutRequest = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(payoutAmount);
    if (isNaN(amount) || amount <= 0) return;
    requestPayout(amount, {
      onSuccess: () => setPayoutAmount('')
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'success':
      case 'completed':
        return <CheckCircle2 size={16} className="text-emerald-500" />;
      case 'failed':
      case 'rejected':
        return <XCircle size={16} className="text-red-500" />;
      default:
        return <Clock size={16} className="text-amber-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'success':
      case 'completed':
        return 'text-emerald-500 bg-emerald-500/10';
      case 'failed':
      case 'rejected':
        return 'text-red-500 bg-red-500/10';
      default:
        return 'text-amber-500 bg-amber-500/10';
    }
  };

  return (
    <div className="p-8 space-y-10">
      <header>
        <h1 className="text-3xl font-semibold text-white">Trainer Wallet</h1>
        <p className="text-gray-400">Manage your earnings and payout requests.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Balance and Payout Form */}
        <div className="lg:col-span-1 space-y-8">
          {/* Balance Card */}
          <div className="bg-[#0d1f17] border border-white/5 rounded-3xl p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
              <Wallet size={80} className="text-[#00ff94]" />
            </div>
            
            <p className="text-gray-400 text-sm font-medium mb-2 uppercase tracking-wider">Available Balance</p>
            <div className="flex items-baseline gap-2 mb-6">
              <IndianRupee size={32} className="text-[#00ff94]" />
              <span className="text-5xl font-bold text-white tracking-tight">
                {data?.walletBalance?.toLocaleString('en-IN') || '0'}
              </span>
            </div>

            <div className="flex items-center gap-2 text-sm text-emerald-400 bg-emerald-400/10 w-fit px-3 py-1 rounded-full">
              <ArrowUpRight size={14} />
              <span>+12% this month</span>
            </div>
          </div>

          {/* Request Payout Form */}
          <div className="bg-white/5 border border-white/5 rounded-3xl p-8">
            <h2 className="text-xl font-medium text-white mb-6 flex items-center gap-2">
              <ArrowDownLeft size={20} className="text-[#00ff94]" />
              Request Payout
            </h2>
            
            <form onSubmit={handlePayoutRequest} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Amount (₹)</label>
                <div className="relative">
                  <IndianRupee size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input 
                    type="number"
                    value={payoutAmount}
                    onChange={(e) => setPayoutAmount(e.target.value)}
                    placeholder="Min. 100"
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-[#00ff94] transition-colors"
                    min="100"
                    required
                  />
                </div>
                <p className="text-[10px] text-gray-500 mt-2 flex items-center gap-1">
                  <AlertCircle size={10} />
                  Funds will be credited to your linked account within 3-5 business days.
                </p>
              </div>

              <button 
                type="submit"
                disabled={isPending || !payoutAmount || parseFloat(payoutAmount) < 100}
                className="w-full bg-[#00ff94] hover:bg-[#00e685] disabled:bg-gray-700 disabled:cursor-not-allowed text-black font-bold py-3 rounded-xl transition-all shadow-[0_0_20px_rgba(0,255,148,0.2)] active:scale-[0.98]"
              >
                {isPending ? 'Processing...' : 'Request Withdrawal'}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Transaction History */}
        <div className="lg:col-span-2">
          <div className="bg-white/5 border border-white/5 rounded-3xl p-8 h-full">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-medium text-white">Recent Transactions</h2>
              <button className="text-[#00ff94] text-sm hover:underline">View All</button>
            </div>

            <div className="space-y-4">
              {data?.recentTransactions && data.recentTransactions.length > 0 ? (
                data.recentTransactions.map((tx: any) => (
                  <div 
                    key={tx.id}
                    className="flex items-center justify-between p-4 rounded-2xl bg-black/20 border border-white/5 hover:border-white/10 transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-xl ${
                        tx.amount > 0 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'
                      }`}>
                        {tx.amount > 0 ? <ArrowUpRight size={20} /> : <ArrowDownLeft size={20} />}
                      </div>
                      <div>
                        <p className="text-white font-medium group-hover:text-[#00ff94] transition-colors">
                          {tx.description}
                        </p>
                        <p className="text-xs text-gray-500">
                          {format(new Date(tx.createdAt), 'MMM dd, yyyy • hh:mm a')}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className={`font-bold ${tx.amount > 0 ? 'text-emerald-500' : 'text-white'}`}>
                        {tx.amount > 0 ? '+' : ''}₹{Math.abs(tx.amount).toLocaleString('en-IN')}
                      </p>
                      <div className={`flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full mt-1 ml-auto w-fit font-medium uppercase tracking-wider ${getStatusColor(tx.status)}`}>
                        {getStatusIcon(tx.status)}
                        {tx.status}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                  <Wallet size={48} className="mb-4 opacity-20" />
                  <p>No transactions yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainerWalletPage;
