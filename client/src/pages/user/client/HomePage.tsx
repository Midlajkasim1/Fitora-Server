import { UserHeader } from "../../../layout/client/ClientHeader";
import { UserFooter } from "../../../layout/client/ClientFooter";
import { ChevronRight } from "lucide-react";
import PremiumDashboardPage from "./PremiumDashboardPage";
import { GlobalLoader } from "../../../shared/GlobalLoader"; 
import { Link } from "react-router-dom";
import { useSubscriptionStatus } from "../../../hooks/user/subscription/check-plan-status";

export default function HomePage() {
  const { data, isLoading } = useSubscriptionStatus();

  if (isLoading) return <GlobalLoader />;

  const hasPremium = !!data?.isPremium;

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
              <div className="relative rounded-[2.5rem] bg-gradient-to-br from-[#132a1e] to-[#0d1f17] border border-white/5 p-12 overflow-hidden flex items-center justify-between min-h-[450px]">
                <div className="relative z-10 max-w-lg">
                  <span className="bg-[#00ff94]/10 text-[#00ff94] text-[10px] font-black uppercase italic tracking-widest px-3 py-1 rounded-full border border-[#00ff94]/20">Best Seller</span>
                  <h1 className="text-6xl font-black italic uppercase tracking-tighter mt-6 leading-none">
                    Ultimate Whey <br /> <span className="text-gray-800 bg-white px-2">Protein</span>
                  </h1>
                  <p className="text-gray-400 mt-6 text-sm font-medium italic">Build lean muscle with 25g of premium protein per scoop.</p>
                  <Link to="/subscription">
                    <button className="mt-8 bg-[#00ff94] text-[#0d1f17] px-8 py-4 rounded-2xl font-black uppercase italic text-sm flex items-center gap-2 hover:shadow-[0_0_30px_rgba(0,255,148,0.3)] transition-all">
                        Shop Now <ChevronRight className="w-4 h-4" />
                    </button>
                  </Link>
                </div>
              </div>
            </section>

            <section className="max-w-7xl mx-auto px-6 py-20 text-center">
                <h2 className="text-5xl font-black italic uppercase tracking-tighter mb-12">Try our premium version</h2>
                <Link to="/subscription">
                   <button className="bg-[#00ff94] text-[#0d1f17] px-10 py-5 rounded-2xl font-black uppercase italic text-sm">View Pricing Plans</button>
                </Link>
            </section>
          </div>
        )}
      </main>
      <UserFooter />
    </div>
  );
}