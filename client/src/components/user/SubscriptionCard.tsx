import { Zap, ChevronRight, Target, Loader2, XCircle } from "lucide-react";

interface PricingCardProps {
  plan: {
    id: string;
    name: string;
    price: string | number;
    billingCycle: string;
    description: string;
  };
  onSubscribe: (id: string) => void;
  onCancel: () => void; // New prop
  isPurchasing: boolean;
  isCancelling: boolean; // New prop for loading state
  isCurrentPlan: boolean; 
}

export const SubscriptionCard = ({ 
  plan, 
  onSubscribe, 
  onCancel,
  isPurchasing, 
  isCancelling,
  isCurrentPlan 
}: PricingCardProps) => {
  const isPro = 
    plan.name.toLowerCase().includes("pro") || 
    plan.name.toLowerCase().includes("performance");

  const formattedDescription = plan.description?.replace(/,/g, '\n');
  
  return (
    <div className={`relative rounded-[2.5rem] p-10 flex flex-col transition-all duration-300 h-full ${
      isCurrentPlan 
        ? "border-2 border-[#00ff94] bg-[#132a1e] shadow-[0_0_40px_rgba(0,255,148,0.15)] scale-105 z-10" 
        : "hover:translate-y-[-10px] bg-[#0a1810] border border-white/5"
    } ${!isCurrentPlan && isPro ? "bg-gradient-to-b from-[#132a1e] to-[#0a1810] border-[#00ff94]/30" : ""}`}>
      
      {isCurrentPlan && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-white text-black text-[9px] font-black uppercase italic px-4 py-1.5 rounded-full tracking-widest shadow-xl">
          Your Active Plan
        </div>
      )}

      {/* ... (Name and Price sections remain the same) ... */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className={`p-2 rounded-lg ${isCurrentPlan || isPro ? "bg-[#00ff94] text-black" : "bg-white/5 text-[#00ff94]"}`}>
            <Zap size={20} />
          </div>
          <h3 className="text-xl font-black italic uppercase tracking-tight text-white">{plan.name}</h3>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-5xl font-black italic tracking-tighter text-white">₹{plan.price}</span>
          <span className="text-gray-500 text-[10px] font-bold uppercase italic">/ {plan.billingCycle}</span>
        </div>
      </div>

      <div className="flex-1 mb-10 space-y-6">
        <div className="flex items-start gap-3">
          <Target size={16} className="text-[#00ff94] mt-1" />
          <p className="text-gray-300 text-[11px] font-bold italic leading-relaxed uppercase tracking-wider whitespace-pre-line">
            {formattedDescription}
          </p>
        </div>
      </div>

      {/* Button Logic Changed Here */}
      <button 
        disabled={isPurchasing || isCancelling}
        onClick={() => isCurrentPlan ? onCancel() : onSubscribe(plan.id)}
        className={`w-full py-5 rounded-2xl font-black uppercase italic text-xs tracking-widest flex items-center justify-center gap-2 transition-all ${
          isCurrentPlan
            ? "bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white" 
            : isPro 
              ? "bg-[#00ff94] text-black hover:shadow-[0_0_30px_rgba(0,255,148,0.4)]" 
              : "bg-white/5 text-white border border-white/10 hover:bg-white/10"
        } ${(isPurchasing || isCancelling) ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        {isPurchasing || isCancelling ? (
          <Loader2 className="animate-spin" size={16} />
        ) : isCurrentPlan ? (
          <>Cancel Subscription <XCircle size={16} /></>
        ) : (
          <>Subscribe Now <ChevronRight size={16} /></>
        )}
      </button>
    </div>
  );
};