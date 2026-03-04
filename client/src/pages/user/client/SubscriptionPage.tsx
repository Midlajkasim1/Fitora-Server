// pages/user/SubscriptionPage.tsx
import { Loader2 } from "lucide-react";
import { useUserSubscriptions } from "../../../hooks/user/subscription/use-user-subscription";
import { SubscriptionCard } from "../../../components/user/SubscriptionCard";
// import { SubscriptionCard } from "../../../components/client/SubscriptionCard";

export default function SubscriptionPage() {
  const { data, isLoading } = useUserSubscriptions();
  const plans = data?.subscriptions ?? [];

  return (
    <div className="max-w-7xl mx-auto py-12">
      {/* Header Section */}
      <div className="text-center mb-20">
        <span className="bg-[#00ff94]/10 text-[#00ff94] text-[10px] font-black uppercase italic tracking-widest px-4 py-1.5 rounded-full border border-[#00ff94]/20">
          Pricing Plans
        </span>
        <h1 className="text-6xl font-black italic uppercase tracking-tighter mt-8 leading-none text-white">
          Level Up Your <br /> <span className="text-gray-800 bg-white px-2">Performance</span>
        </h1>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {isLoading ? (
          <div className="col-span-3 flex justify-center py-20">
            <Loader2 className="w-10 h-10 text-[#00ff94] animate-spin" />
          </div>
        ) : (
          plans.map((plan) => (
            <SubscriptionCard key={plan.id} plan={plan} />
          ))
        )}
      </div>
    </div>
  );
}