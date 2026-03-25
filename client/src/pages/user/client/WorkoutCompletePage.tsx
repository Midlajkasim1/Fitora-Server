import { useLocation, useNavigate } from "react-router-dom";
import { Flame, CheckCircle, Loader2, ArrowRight } from "lucide-react";
import { useUserSubscriptions } from "../../../hooks/user/subscription/use-user-subscription";
import { usePurchasePlan } from "../../../hooks/user/subscription/use-purchase-plan";
import { useSubscriptionStatus } from "../../../hooks/user/subscription/check-plan-status";

export default function WorkoutCompletedPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { calories, title } = location.state || { calories: 0, title: "Workout" };

  // Fetch real data
  const { data: subscriptionData, isLoading: plansLoading } = useUserSubscriptions(1); // Page 1
  const { data: statusData, isLoading: statusLoading } = useSubscriptionStatus();
  const { mutate: purchasePlan, isPending: isPurchasing, variables: purchasingId } = usePurchasePlan();

  const isPremium = statusData?.isPremium;
  const plans = subscriptionData?.subscriptions ?? [];

  return (
    <div className="min-h-screen bg-[#07140f] text-white flex flex-col items-center py-20 p-6 text-center">
      <CheckCircle size={80} className="text-[#00ff94] mb-6 animate-bounce" />
      
      <h1 className="text-5xl font-black uppercase italic mb-2 tracking-tighter">Workout Complete!</h1>
      <p className="text-gray-400 mb-8 font-bold uppercase tracking-widest">You finished: {title}</p>

      <div className="bg-[#0d1f17] p-10 rounded-[3rem] border border-[#00ff94]/20 mb-12 flex flex-col items-center min-w-[300px]">
        <Flame size={40} className="text-orange-500 mb-2" />
        <span className="text-7xl font-black italic text-[#00ff94]">{calories}</span>
        <p className="text-gray-500 font-black uppercase tracking-widest text-xs mt-2">Total Calories Burned</p>
      </div>

      <hr className="w-full max-w-md border-white/10 mb-12" />

      {/* Subscription Section - Only show if user is NOT premium */}
      {!isPremium && !statusLoading && (
        <div className="w-full max-w-4xl">
          <h2 className="text-2xl font-black uppercase italic mb-2">Don't Stop Now</h2>
          <p className="text-gray-500 mb-8 font-bold uppercase text-[10px] tracking-[0.2em]">Unlock pro tracking & Olympic-level specialization</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {plansLoading ? (
              <div className="col-span-2 flex justify-center py-10">
                <Loader2 className="animate-spin text-[#00ff94]" />
              </div>
            ) : (
              plans.slice(0, 2).map((plan) => (
                <div 
                  key={plan.id}
                  className="group bg-white/5 p-8 rounded-[2.5rem] border border-white/10 hover:border-[#00ff94]/50 transition-all flex flex-col items-center relative overflow-hidden"
                >
                    {/* Background Glow Effect */}
                  <div className="absolute inset-0 bg-[#00ff94]/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                  
                  <h3 className="font-black italic text-xl mb-1 uppercase text-white">{plan.name}</h3>
                  <p className="text-gray-500 font-bold text-[10px] uppercase mb-4 tracking-widest">{plan.billingCycle} ACCESS</p>
                  
                  <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-4xl font-black text-[#00ff94]">₹{plan.price}</span>
                  </div>

                  <button 
                    disabled={isPurchasing}
                    onClick={() => purchasePlan(plan.id)}
                    className="w-full py-4 bg-[#00ff94] text-black font-black uppercase italic text-xs rounded-2xl hover:scale-[1.02] transition-transform flex items-center justify-center gap-2"
                  >
                    {isPurchasing && purchasingId === plan.id ? (
                      <Loader2 className="animate-spin" size={16} />
                    ) : (
                      <>Get Started <ArrowRight size={16} /></>
                    )}
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {isPremium && (
        <div className="bg-[#00ff94]/10 border border-[#00ff94]/20 p-6 rounded-3xl max-w-md">
            <p className="text-[#00ff94] font-black italic uppercase text-sm">Pro Member Advantage</p>
            <p className="text-gray-400 text-xs mt-2 italic">Your stats are being analyzed by our AI to optimize your next session.</p>
        </div>
      )}

      <button 
        onClick={() => navigate("/home")} 
        className="mt-12 text-gray-500 hover:text-white font-bold uppercase text-[10px] tracking-widest transition-colors"
      >
        Back to Dashboard
      </button>
    </div>
  );
}