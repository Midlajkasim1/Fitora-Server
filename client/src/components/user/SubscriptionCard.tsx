// components/user/SubscriptionCard.tsx
import { Zap, ChevronRight, Target, Loader2 } from "lucide-react";

interface PricingCardProps {
  plan: {
    id: string;
    name: string;
    price: string | number;
    billingCycle: string;
    description: string;
  };
  onSubscribe: (id: string) => void;
  isPurchasing: boolean; // Managed by the parent page
}

export const SubscriptionCard = ({ plan, onSubscribe, isPurchasing }: PricingCardProps) => {
  const isPro = 
    plan.name.toLowerCase().includes("pro") || 
    plan.name.toLowerCase().includes("performance");

  const formattedDescription = plan.description?.replace(/,/g, '\n');
  
  return (
    <div className={`relative rounded-[2.5rem] p-10 flex flex-col transition-all duration-300 hover:translate-y-[-10px] h-full ${
      isPro 
        ? "bg-gradient-to-b from-[#132a1e] to-[#0a1810] border-2 border-[#00ff94]/50 shadow-[0_20px_50px_rgba(0,255,148,0.1)]" 
        : "bg-[#0a1810] border border-white/5"
    }`}>
      
      {isPro && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#00ff94] text-black text-[9px] font-black uppercase italic px-4 py-1 rounded-full tracking-widest">
          Most Popular
        </div>
      )}

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className={`p-2 rounded-lg ${isPro ? "bg-[#00ff94] text-black" : "bg-white/5 text-[#00ff94]"}`}>
            <Zap size={20} />
          </div>
          <h3 className="text-xl font-black italic uppercase tracking-tight text-white">
            {plan.name}
          </h3>
        </div>
        
        <div className="flex items-baseline gap-1">
          <span className="text-5xl font-black italic tracking-tighter text-white">
            ₹{plan.price}
          </span>
          <span className="text-gray-500 text-[10px] font-bold uppercase italic">
            / {plan.billingCycle}
          </span>
        </div>
      </div>

      <div className="flex-1 mb-10 space-y-6">
        <div className="flex items-start gap-3">
          <div className="mt-1">
            <Target size={16} className="text-[#00ff94]" />
          </div>
          <p className="text-gray-300 text-[11px] font-bold italic leading-relaxed uppercase tracking-wider whitespace-pre-line">
            {formattedDescription}
          </p>
        </div>
        
        <div className="w-full h-px bg-white/5" />
        
        <p className="text-[9px] text-gray-500 font-black uppercase italic tracking-widest opacity-60">
          Full Access to FitAdmin Tracking
        </p>
      </div>

      <button 
        disabled={isPurchasing}
        onClick={() => onSubscribe(plan.id)}
        className={`w-full py-5 rounded-2xl font-black uppercase italic text-xs tracking-widest flex items-center justify-center gap-2 transition-all ${
          isPro 
          ? "bg-[#00ff94] text-black hover:shadow-[0_0_30px_rgba(0,255,148,0.4)]" 
          : "bg-white/5 text-white border border-white/10 hover:bg-white/10"
        } ${isPurchasing ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        {isPurchasing ? (
          <Loader2 className="animate-spin" size={16} />
        ) : (
          <>Subscribe Now <ChevronRight size={16} /></>
        )}
      </button>
    </div>
  );
};