import { useNavigate } from "react-router-dom";
import { CheckCircle, ArrowRight } from "lucide-react";

 const PaymentSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0a1810] flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center space-y-8 p-10 rounded-[2.5rem] bg-gradient-to-b from-[#132a1e] to-[#0a1810] border-2 border-[#00ff94]/30 shadow-[0_20px_50px_rgba(0,255,148,0.15)]">
        <div className="flex justify-center">
          <CheckCircle size={64} className="text-[#00ff94] animate-bounce" />
        </div>
        <div className="space-y-4">
          <h1 className="text-4xl font-black italic uppercase text-white">Payment <span className="text-[#00ff94]">Successful</span></h1>
          <p className="text-gray-400 text-sm font-bold italic uppercase">Premium features unlocked. Let's finish your health profile.</p>
        </div>
        <button 
          onClick={() => navigate("/health-metrics")}
          className="w-full py-5 bg-[#00ff94] text-black font-black uppercase italic text-sm tracking-widest rounded-2xl flex items-center justify-center gap-2 hover:shadow-[0_0_30px_rgba(0,255,148,0.4)]"
        >
          Final Step: Health Metrics <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccess