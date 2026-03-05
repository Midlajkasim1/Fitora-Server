import { Loader2, TrendingUp, Zap, ShieldCheck } from "lucide-react";
import { useUserSubscriptions } from "../../../hooks/user/subscription/use-user-subscription";
import { usePurchasePlan } from "../../../hooks/user/subscription/use-purchase-plan";
import { SubscriptionCard } from "../../../components/user/SubscriptionCard";

export default function SubscriptionPage() {
  const { data, isLoading } = useUserSubscriptions();
  const { mutate, isPending, variables } = usePurchasePlan();

  const plans = data?.subscriptions ?? [];

  return (
    <div className="max-w-7xl mx-auto py-12 px-6">
      <div className="text-center mb-20">
        <span className="bg-[#00ff94]/10 text-[#00ff94] text-[10px] font-black uppercase italic tracking-widest px-4 py-1.5 rounded-full border border-[#00ff94]/20">
          Pricing Plans
        </span>
        <h1 className="text-6xl font-black italic uppercase tracking-tighter mt-8 leading-none text-white">
          Level Up Your <br /> <span className="text-gray-800 bg-white px-2">Performance</span>
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
        {isLoading ? (
          <div className="col-span-3 flex justify-center py-20">
            <Loader2 className="w-10 h-10 text-[#00ff94] animate-spin" />
          </div>
        ) : (
          plans.map((plan) => (
            <SubscriptionCard 
              key={plan.id} 
              plan={plan} 
              onSubscribe={(id) => mutate(id)}
              // isPending is true while waiting for the checkoutUrl
              // variables is the plan.id that was passed to mutate()
              isPurchasing={isPending && variables === plan.id}
            />
          ))
        )}
      </div>

      <section className="border-t border-white/5 pt-20 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          <div className="space-y-4">
            <div className="w-12 h-12 bg-[#00ff94]/10 rounded-2xl flex items-center justify-center mx-auto text-[#00ff94]">
              <TrendingUp size={24} />
            </div>
            <h3 className="text-white font-black italic uppercase text-lg">Accelerate Results</h3>
            <p className="text-gray-500 text-xs italic leading-relaxed">
              Users with premium subscriptions see 40% faster progress through AI-optimized load adjustments.
            </p>
          </div>

          <div className="space-y-4">
            <div className="w-12 h-12 bg-[#00ff94]/10 rounded-2xl flex items-center justify-center mx-auto text-[#00ff94]">
              <Zap size={24} />
            </div>
            <h3 className="text-white font-black italic uppercase text-lg">Exclusive Content</h3>
            <p className="text-gray-500 text-xs italic leading-relaxed">
              Access workout specializations designed by Olympic-level trainers not available in the free tier.
            </p>
          </div>

          <div className="space-y-4">
            <div className="w-12 h-12 bg-[#00ff94]/10 rounded-2xl flex items-center justify-center mx-auto text-[#00ff94]">
              <ShieldCheck size={24} />
            </div>
            <h3 className="text-white font-black italic uppercase text-lg">Cancel Anytime</h3>
            <p className="text-gray-500 text-xs italic leading-relaxed">
              No hidden contracts. Manage your billing easily through your dashboard with a single click.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}