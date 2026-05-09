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
import { Pagination } from '../../../components/admin/Pagination';

const TrainerWalletPage = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useTrainerWallet(page, 10);
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
    <div className="p-4 md:p-8 space-y-6 md:space-y-10 bg-[#06110d] min-h-screen">
      <header>
        <h1 className="text-2xl md:text-3xl font-bold text-white uppercase tracking-tighter italic">Trainer Wallet</h1>
        <p className="text-xs md:text-sm text-gray-400 font-medium mt-1">Manage your earnings and payout requests.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Left Column: Balance and Payout Form */}
        <div className="lg:col-span-1 space-y-6 md:space-y-8">
          {/* Balance Card */}
          <div className="bg-[#0d1f17] border border-white/5 rounded-3xl p-6 md:p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
              <Wallet size={60} className="md:w-20 md:h-20 text-[#00ff94]" />
            </div>
            
            <p className="text-gray-400 text-[10px] md:text-xs font-black uppercase italic tracking-widest mb-2">Available Balance</p>
            <div className="flex items-baseline gap-2 mb-4 md:mb-6">
              <IndianRupee size={24} className="md:w-8 md:h-8 text-[#00ff94]" />
              <span className="text-4xl md:text-5xl font-black text-white tracking-tighter italic">
                {data?.walletBalance?.toLocaleString('en-IN') || '0'}
              </span>
            </div>

            <div className="flex items-center gap-2 text-[10px] md:text-sm text-emerald-400 bg-emerald-400/10 w-fit px-3 py-1 rounded-full font-bold uppercase italic">
              <ArrowUpRight size={14} />
              <span>+12% this month</span>
            </div>
          </div>

          {/* Request Payout Form */}
          <div className="bg-white/5 border border-white/5 rounded-3xl p-6 md:p-8">
            <h2 className="text-lg md:text-xl font-black text-white uppercase italic mb-6 flex items-center gap-2">
              <ArrowDownLeft size={20} className="text-[#00ff94]" />
              Request Payout
            </h2>
            
            <form onSubmit={handlePayoutRequest} className="space-y-4">
              <div>
                <label className="block text-[10px] md:text-xs font-black uppercase italic text-gray-400 mb-2">Amount (₹)</label>
                <div className="relative">
                  <IndianRupee size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input 
                    type="number"
                    value={payoutAmount}
                    onChange={(e) => setPayoutAmount(e.target.value)}
                    placeholder="Min. 100"
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white text-sm focus:outline-none focus:border-[#00ff94] transition-colors font-bold"
                    min="100"
                    required
                  />
                </div>
                <p className="text-[9px] md:text-[10px] text-gray-500 mt-3 flex items-start gap-1 font-bold uppercase italic leading-tight">
                  <AlertCircle size={10} className="shrink-0 mt-0.5" />
                  <span>Funds will be credited to your account within 3-5 business days.</span>
                </p>
              </div>

              <button 
                type="submit"
                disabled={isPending || !payoutAmount || parseFloat(payoutAmount) < 100}
                className="w-full bg-[#00ff94] hover:bg-[#00e685] disabled:bg-white/5 disabled:text-gray-600 disabled:cursor-not-allowed text-black font-black py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(0,255,148,0.2)] active:scale-[0.98] uppercase italic text-[11px] tracking-wider"
              >
                {isPending ? 'Processing...' : 'Request Withdrawal'}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Transaction History */}
        <div className="lg:col-span-2">
          <div className="bg-white/5 border border-white/5 rounded-3xl p-4 md:p-8 min-h-full flex flex-col">
            <div className="flex justify-between items-center mb-6 md:mb-8">
              <h2 className="text-lg md:text-xl font-black text-white uppercase italic">Transaction History</h2>
            </div>

            <div className="flex-1 space-y-4">
              {data?.transactions && data.transactions.length > 0 ? (
                <>
                  <div className="space-y-3 md:space-y-4">
                    {data.transactions.map((tx: any) => (
                      <div 
                        key={tx.id}
                        className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-2xl bg-black/20 border border-white/5 hover:border-[#00ff94]/20 transition-all group gap-4 md:gap-0"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`p-2.5 md:p-3 rounded-xl shrink-0 ${
                            tx.amount > 0 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'
                          }`}>
                            {tx.amount > 0 ? <ArrowUpRight size={18} /> : <ArrowDownLeft size={18} />}
                          </div>
                          <div className="min-w-0">
                            <p className="text-white text-xs md:text-sm font-black uppercase italic group-hover:text-[#00ff94] transition-colors truncate pr-2">
                              {tx.description}
                            </p>
                            <p className="text-[9px] md:text-xs text-gray-500 font-bold uppercase italic mt-0.5">
                              {format(new Date(tx.createdAt), 'MMM dd, yyyy • hh:mm a')}
                            </p>
                          </div>
                        </div>

                        <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center border-t md:border-t-0 border-white/5 pt-3 md:pt-0">
                          <p className={`font-black italic text-sm md:text-base ${tx.amount > 0 ? 'text-emerald-500' : 'text-white'}`}>
                            {tx.amount > 0 ? '+' : ''}₹{Math.abs(tx.amount).toLocaleString('en-IN')}
                          </p>
                          <div className={`flex items-center gap-1 text-[8px] md:text-[10px] px-2 py-0.5 rounded-full mt-1 font-black uppercase italic tracking-widest ${getStatusColor(tx.status)}`}>
                            {getStatusIcon(tx.status)}
                            {tx.status}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Pagination Controls */}
                  {data?.pagination && data.pagination.total > 0 && (
                    <div className="pt-6 md:pt-8 mt-auto border-t border-white/5">
                      <Pagination
                        currentPage={page}
                        totalPages={data.pagination.totalPages}
                        totalResults={data.pagination.total}
                        resultsPerPage={10}
                        onPageChange={(p) => setPage(p)}
                      />
                    </div>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                  <Wallet size={48} className="mb-4 opacity-10" />
                  <p className="text-[10px] font-black uppercase italic tracking-widest">No transactions yet</p>
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
