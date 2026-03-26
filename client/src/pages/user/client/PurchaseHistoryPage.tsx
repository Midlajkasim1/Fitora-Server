import { useState } from "react";
import { Pagination } from "../../../components/admin/Pagination";
import { format } from "date-fns";
import { Receipt, CheckCircle2, XCircle, Clock, Ban } from "lucide-react";
import { usePurchaseHistory } from "../../../hooks/user/subscription/use-purchaseHistory";
import { useCancelSubscription } from "../../../hooks/user/subscription/use-cancel-subscription";
import { ConfirmModal } from "../../../shared/ConfirmModal";

export default function PurchaseHistoryPage() {
  const [page, setPage] = useState(1);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const { data, isLoading } = usePurchaseHistory(page);
  const { mutate: cancelPlan, isPending: isCancelling } = useCancelSubscription();

  const getStatusBadge = (status: string, subStatus: string) => {
    if (status === "success") {
      if (subStatus === "cancelled") {
        return <span className="flex items-center gap-1.5 text-orange-400 bg-orange-400/10 px-3 py-1 rounded-full text-[10px] font-black uppercase italic border border-orange-400/20">
          <Clock size={12} /> Canceled
        </span>;
      }
      return <span className="flex items-center gap-1.5 text-[#00ff94] bg-[#00ff94]/10 px-3 py-1 rounded-full text-[10px] font-black uppercase italic border border-[#00ff94]/20">
        <CheckCircle2 size={12} /> Success
      </span>;
    }
    return <span className="flex items-center gap-1.5 text-red-500 bg-red-500/10 px-3 py-1 rounded-full text-[10px] font-black uppercase italic border border-red-500/20">
      <XCircle size={12} /> Failed
    </span>;
  };

  if (isLoading) return <div className="py-40 text-center text-[#00ff94] font-black italic uppercase animate-pulse">Retrieving Transactions...</div>;

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 space-y-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-[#00ff94] p-3 rounded-2xl text-black">
            <Receipt size={24} />
          </div>
          <h1 className="text-4xl font-black text-white italic uppercase tracking-tight">
            Billing <span className="text-[#00ff94]">History</span>
          </h1>
        </div>
      </div>

      <div className="bg-[#0a1810] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/5">
                <th className="p-6 text-[10px] font-black text-gray-500 uppercase italic tracking-widest">Date</th>
                <th className="p-6 text-[10px] font-black text-gray-500 uppercase italic tracking-widest">Plan</th>
                <th className="p-6 text-[10px] font-black text-gray-500 uppercase italic tracking-widest">Method</th>
                <th className="p-6 text-[10px] font-black text-gray-500 uppercase italic tracking-widest">Amount</th>
                <th className="p-6 text-[10px] font-black text-gray-500 uppercase italic tracking-widest text-center">Status</th>
                <th className="p-6 text-[10px] font-black text-gray-500 uppercase italic tracking-widest text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {data?.history.map((item) => (
                <tr key={item.paymentId} className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-6 text-xs font-bold text-gray-300 italic">
                    {format(new Date(item.date), "MMM dd, yyyy")}
                  </td>
                  <td className="p-6">
                    <div className="text-sm font-black text-white italic uppercase tracking-tight">{item.planName}</div>
                    <div className="text-[9px] text-gray-500 font-bold uppercase tracking-tighter">ID: {item.paymentId.slice(-8)}</div>
                  </td>
                  <td className="p-6 text-[10px] font-black text-gray-400 uppercase italic tracking-widest">
                    {item.paymentMethod}
                  </td>
                  <td className="p-6 text-lg font-black text-white italic">
                    ₹{item.amount}
                  </td>
                  <td className="p-6">
                    <div className="flex justify-center">
                      {getStatusBadge(item.status, item.subscriptionStatus)}
                    </div>
                  </td>
                  <td className="p-6 text-right">
                    {item.status === "success" && item.subscriptionStatus === "active" ? (
                      <button
                        disabled={isCancelling}
                        onClick={() => {

                          setIsCancelModalOpen(true);
                        }}
                        className={`px-5 py-2 border border-red-500/20 text-red-500 rounded-xl text-[10px] font-black uppercase italic tracking-widest transition-all active:scale-95
                    ${isCancelling ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-500 hover:text-white hover:border-red-500 hover:shadow-[0_0_15px_rgba(239,68,68,0.3)]'}
                        `}
                      >
                        {isCancelling ? "Processing..." : "Cancel Plan"}
                      </button>
                    ) : (
                      <span className="text-[9px] text-gray-700 uppercase font-black italic tracking-tighter opacity-50">
                        {item.subscriptionStatus === "cancelled" ? "No Actions" : "N/A"}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {data && data.total > 0 && (
        <Pagination
          currentPage={page}
          totalPages={Math.ceil(data.total / 10)}
          totalResults={data.total}
          resultsPerPage={10}
          onPageChange={setPage}
        />
      )}

      <ConfirmModal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        onConfirm={() => {
          cancelPlan();
          setIsCancelModalOpen(false);
        }}
        title="Cancel Active Subscription?"
        message="Are you sure you want to cancel your current plan? You will retain access until the end of the current billing period."
        confirmText={isCancelling ? "Processing..." : "Yes, Cancel Plan"}
      />
    </div>
  );
}