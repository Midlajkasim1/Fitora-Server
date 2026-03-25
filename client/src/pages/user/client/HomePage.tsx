import { Link, Navigate } from "react-router-dom";
import { useSubscriptionStatus } from "../../../hooks/user/subscription/check-plan-status";
import { useHealthMetrics } from "../../../hooks/user/use-healthMetrics";
import { UserFooter } from "../../../layout/client/ClientFooter";
import { UserHeader } from "../../../layout/client/ClientHeader";
import { GlobalLoader } from "../../../shared/GlobalLoader";
import PremiumDashboardPage from "./PremiumDashboardPage";
import { useActiveAds } from "../../../hooks/user/advertisement/use-active-advertisement";
import { AdCarousel } from "../../../components/user/AdCarousel";

export default function HomePage() {
const { data: metrics, isLoading: isMetricsLoading } = useHealthMetrics();
const { data: subData, isLoading: isSubLoading } = useSubscriptionStatus();
const { data: adData, isLoading: isAdLoading } = useActiveAds();
  if (isMetricsLoading || isSubLoading || isAdLoading) return <GlobalLoader />;

  if (subData?.isPremium && metrics?.exists === false) {
    return <Navigate to="/health-metrics" replace />;
  }
  const hasPremium = !!subData?.isPremium;
const activeAd = adData?.advertisement?.[0];
  return (
   <div className="min-h-screen bg-[#0d1f17] text-white flex flex-col font-sans">
      <UserHeader />
      <main className="flex-1 pt-20">
        {hasPremium ? (
          <div className="max-w-7xl mx-auto px-6 py-12 animate-in fade-in duration-700">
             <PremiumDashboardPage />
          </div>
        ) : (
          <div className="animate-in slide-in-from-bottom-4 duration-700">
            <section className="max-w-7xl mx-auto px-6 py-12">
              {/* Dynamic Advertisement Carousel */}
              {activeAd ? (
                <AdCarousel ad={activeAd} />
              ) : (
                /* Fallback if no ads are active */
                <div className="relative rounded-[2.5rem] bg-gradient-to-br from-[#132a1e] to-[#0d1f17] border border-white/5 p-12 overflow-hidden flex items-center min-h-[450px]">
                   <h1 className="text-4xl font-black italic uppercase text-white/20">Fitora Fitness</h1>
                </div>
              )}
            </section>

            <section className="max-w-7xl mx-auto px-6 py-20 text-center">
                <h2 className="text-5xl font-black italic uppercase tracking-tighter mb-12">Try our premium version</h2>
                <Link to="/subscription">
                    <button className="bg-[#00ff94] text-[#0d1f17] px-10 py-5 rounded-2xl font-black uppercase italic text-sm hover:scale-105 transition-transform">
                      View Pricing Plans
                    </button>
                </Link>
            </section>
          </div>
        )}
      </main>
      <UserFooter />
    </div>
  );
}