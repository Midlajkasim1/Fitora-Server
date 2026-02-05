import { UserHeader } from "../../../layout/client/ClientHeader";
import { UserFooter } from "../../../layout/client/ClientFooter";
import { ChevronRight } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0d1f17] text-white flex flex-col font-sans">
      <UserHeader />

      <main className="flex-1 pt-20">
        
        <section className="max-w-7xl mx-auto px-6 py-12">
          <div className="relative rounded-[2.5rem] bg-gradient-to-br from-[#132a1e] to-[#0d1f17] border border-white/5 p-12 overflow-hidden flex items-center justify-between min-h-[450px]">
            <div className="relative z-10 max-w-lg">
              <span className="bg-[#00ff94]/10 text-[#00ff94] text-[10px] font-black uppercase italic tracking-widest px-3 py-1 rounded-full border border-[#00ff94]/20">Best Seller</span>
              <h1 className="text-6xl font-black italic uppercase tracking-tighter mt-6 leading-none">
                Ultimate Whey <br /> <span className="text-gray-800 bg-white px-2">Protein</span>
              </h1>
              <p className="text-gray-400 mt-6 text-sm font-medium italic">Build lean muscle with 25g of premium protein per scoop. Enhanced with digestive enzymes for fast absorption.</p>
              <button className="mt-8 bg-[#00ff94] text-[#0d1f17] px-8 py-4 rounded-2xl font-black uppercase italic text-sm flex items-center gap-2 hover:shadow-[0_0_30px_rgba(0,255,148,0.3)] transition-all">
                Shop Now <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="hidden lg:block relative w-80 h-80">
               <div className="absolute inset-0 bg-[#00ff94]/5 blur-[100px] rounded-full" />
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black italic uppercase tracking-tighter">Our Services</h2>
            <p className="text-gray-500 text-xs mt-4 italic tracking-widest">Everything you need to transform your body with AI.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {["AI Coach", "Real-time Analytics", "Smart Diet", "Community"].map((service, i) => (
              <div key={i} className="bg-[#0a1810] border border-white/5 p-8 rounded-[1.5rem] hover:border-[#00ff94]/30 transition-all group">
                <div className="w-10 h-10 bg-[#00ff94]/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-[#00ff94] transition-all">
                  <div className="w-4 h-4 border-2 border-[#00ff94] group-hover:border-[#0a1810]" />
                </div>
                <h3 className="font-black italic uppercase text-sm mb-2">{service}</h3>
                <p className="text-gray-600 text-[10px] font-medium leading-relaxed italic">Personalized plans that adapt to your performance daily.</p>
              </div>
            ))}
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-6 py-20 text-center">
            <h2 className="text-5xl font-black italic uppercase tracking-tighter mb-12">Try our premium version</h2>
            <div className="flex items-center justify-center gap-8">
                <button className="bg-[#00ff94] text-[#0d1f17] px-10 py-5 rounded-2xl font-black uppercase italic text-sm">Workouts</button>
                <button className="text-white text-xs font-bold uppercase italic hover:text-[#00ff94] transition-colors">View Pricing Plans</button>
            </div>
        </section>

      </main>

      <UserFooter />
    </div>
  );
}