import { useNavigate } from "react-router-dom";
import { XCircle, RefreshCcw } from "lucide-react";

 const PaymentFailed = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0a1810] flex items-center justify-center px-6 text-center">
      <div className="max-w-md w-full p-10 rounded-[2.5rem] bg-[#0a1810] border border-red-500/30">
        <XCircle size={64} className="text-red-500 mx-auto mb-6" />
        <h1 className="text-4xl font-black italic uppercase text-white mb-4">Payment <span className="text-red-500">Failed</span></h1>
        <p className="text-gray-400 text-sm mb-8">Your card was not charged. Please try again or use a different payment method.</p>
        <button onClick={() => navigate("/subscriptions")} className="w-full py-5 bg-white/5 text-white border border-white/10 font-black uppercase italic text-sm rounded-2xl flex items-center justify-center gap-2">
          Try Again <RefreshCcw size={18} />
        </button>
      </div>
    </div>
  );
};
export default PaymentFailed