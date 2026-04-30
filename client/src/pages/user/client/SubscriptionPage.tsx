import { TrendingUp, Zap, ShieldCheck } from "lucide-react";
import { GlobalLoader } from "../../../shared/GlobalLoader";
import { useState } from "react";
import { useUserSubscriptions } from "../../../hooks/user/subscription/use-user-subscription";
import { usePurchasePlan } from "../../../hooks/user/subscription/use-purchase-plan";
import { useCancelSubscription } from "../../../hooks/user/subscription/use-cancel-subscription";
import { useSubscriptionStatus } from "../../../hooks/user/subscription/check-plan-status";
import { SubscriptionCard } from "../../../components/user/SubscriptionCard";
import { ConfirmModal } from "../../../shared/ConfirmModal";
import { Pagination } from "../../../components/admin/Pagination";

export default function SubscriptionPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  const { data, isLoading } = useUserSubscriptions(currentPage);
  const { data: statusData, isLoading: isStatusLoading } = useSubscriptionStatus();
  
  const { mutate: purchasePlan, isPending: isPurchasing, variables: purchasingId } = usePurchasePlan();
  const { mutate: cancelPlan, isPending: isCancelling } = useCancelSubscription();

  const resultsPerPage = 1; 
  const totalResults = data?.totals || 0;
  const totalPages = Math.ceil(totalResults / resultsPerPage);
  const plans = data?.subscriptions ?? [];
  
  const activePlanId = statusData?.subscription?.planId;

  if (isLoading || isStatusLoading) return <GlobalLoader />;

  return (
    <div className="max-w-7xl mx-auto py-8 md:py-12 px-4 md:px-6">
      {/* Header Section */}
      <div className="text-center mb-12 md:mb-20">
        <span className="bg-[#00ff94]/10 text-[#00ff94] text-[10px] font-black uppercase italic tracking-widest px-4 py-1.5 rounded-full border border-[#00ff94]/20">
          Pricing Plans
        </span>
        <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter mt-6 md:mt-8 leading-none text-white">
          Level Up Your <br /> <span className="text-gray-800 bg-white px-2">Performance</span>
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-20 md:mb-32">
        {plans.map((plan) => (
          <SubscriptionCard 
            key={plan.id} 
            plan={plan as unknown as { id: string; name: string; price: string | number; billingCycle: string; description: string; }} 
            onSubscribe={(id) => purchasePlan(id)}
            onCancel={() => setIsCancelModalOpen(true)}
            isPurchasing={isPurchasing && purchasingId === plan.id}
            isCancelling={isCancelling}
            isCurrentPlan={activePlanId === plan.id}
          />
        ))}
      </div>

      {/* Pagination Section */}
      {totalResults > 0 && (
        <div className="pt-12 border-t border-white/5">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalResults={totalResults}
            resultsPerPage={resultsPerPage}
            onPageChange={(page) => {
              setCurrentPage(page);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        </div>
      )}

      {/* Feature Section */}
      <section className="border-t border-white/5 pt-12 md:pt-20 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 text-center">
          <div className="space-y-4">
            <div className="w-12 h-12 bg-[#00ff94]/10 rounded-2xl flex items-center justify-center mx-auto text-[#00ff94]">
              <TrendingUp size={24} />
            </div>
            <h3 className="text-white font-black italic uppercase text-base md:text-lg">Accelerate Results</h3>
            <p className="text-gray-500 text-[10px] md:text-xs italic leading-relaxed">
              Users with premium subscriptions see 40% faster progress through AI-optimized load adjustments.
            </p>
          </div>

          <div className="space-y-4">
            <div className="w-12 h-12 bg-[#00ff94]/10 rounded-2xl flex items-center justify-center mx-auto text-[#00ff94]">
              <Zap size={24} />
            </div>
            <h3 className="text-white font-black italic uppercase text-base md:text-lg">Exclusive Content</h3>
            <p className="text-gray-500 text-[10px] md:text-xs italic leading-relaxed">
              Access workout specializations designed by Olympic-level trainers.
            </p>
          </div>

          <div className="space-y-4">
            <div className="w-12 h-12 bg-[#00ff94]/10 rounded-2xl flex items-center justify-center mx-auto text-[#00ff94]">
              <ShieldCheck size={24} />
            </div>
            <h3 className="text-white font-black italic uppercase text-base md:text-lg">Cancel Anytime</h3>
            <p className="text-gray-500 text-[10px] md:text-xs italic leading-relaxed">
              No hidden contracts. Manage your billing easily through your dashboard.
            </p>
          </div>
        </div>
      </section>

      <ConfirmModal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        onConfirm={() => cancelPlan()}
        title="Stop Your Progress?"
        message="Cancelling your plan will remove your access to AI tracking and premium content at the end of this billing cycle."
        confirmText={isCancelling ? "Cancelling..." : "Confirm Cancellation"}
      />
    </div>
  );
}