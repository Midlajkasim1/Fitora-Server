import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../../layout/Header';
import { Footer } from '../../layout/Footer';
import { 
  Zap, 
  Dumbbell, 
  Utensils, 
  Video, 
  TrendingUp, 
  ShieldAlert,
  ArrowRight,
  Sparkles
} from 'lucide-react';

const FeaturesPage: React.FC = () => {
  const navigate = useNavigate();

  const coreFeatures = [
    {
      icon: Zap,
      title: "AI Training Protocol",
      description: "Get weekly workouts optimized by machine learning. Our system learns from your performance data and automatically adjusts reps, sets, and intensities.",
      color: "from-emerald-400 to-teal-500",
      glowColor: "rgba(0, 255, 148, 0.15)"
    },
    {
      icon: Utensils,
      title: "Smart Nutrition Guide",
      description: "Receive AI-generated diet plans aligned with your goals. Alternate protein, carbohydrates, and meal setups daily to keep nutrition exciting and effective.",
      color: "from-orange-400 to-amber-500",
      glowColor: "rgba(245, 158, 11, 0.15)"
    },
    {
      icon: Video,
      title: "Live Video Sessions",
      description: "Schedule and join group or individual live video calls with top trainers right inside the browser. Streamlined slots booking and video connections.",
      color: "from-blue-400 to-indigo-500",
      glowColor: "rgba(59, 130, 246, 0.15)"
    },
    {
      icon: Dumbbell,
      title: "Custom Workout Library",
      description: "Explore a massive library of workouts created by verified trainers and curated for specific specialties. Perfect form tips and rest time details.",
      color: "from-pink-400 to-rose-500",
      glowColor: "rgba(244, 63, 94, 0.15)"
    },
    {
      icon: TrendingUp,
      title: "Weekly Health Metrics",
      description: "Track your progress with advanced analytics. Log your body weight, visualize fat percentage drop, and inspect complete historical performance graphs.",
      color: "from-cyan-400 to-blue-500",
      glowColor: "rgba(6, 182, 212, 0.15)"
    },
    {
      icon: ShieldAlert,
      title: "Safe Onboarding Protocol",
      description: "We assess your physical profile, lifestyle, and dietary limitations during onboarding to ensure all generated recommendations are perfectly safe for you.",
      color: "from-red-400 to-rose-600",
      glowColor: "rgba(239, 68, 68, 0.15)"
    }
  ];

  return (
    <div className="min-h-screen w-full bg-[#0a1810] selection:bg-[#00ff94] selection:text-[#0d1f17] font-sans overflow-x-hidden text-white">
      <Header />

      <main className="relative pt-32 pb-24 px-4 sm:px-6 lg:px-8">
        {/* Decorative ambient glows */}
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-[#00ff94]/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-1/2 right-0 w-80 h-80 bg-emerald-500/5 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          
          {/* Header Section */}
          <div className="text-center max-w-3xl mx-auto mb-20">
            <div className="inline-flex items-center gap-2 bg-[#00ff94]/10 border border-[#00ff94]/20 rounded-full px-4 py-2 mb-6">
              <Sparkles size={14} className="text-[#00ff94]" />
              <span className="text-[#00ff94] text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em]">Next-Gen Capabilities</span>
            </div>
            <h1 className="text-4xl sm:text-6xl font-black italic tracking-tighter uppercase mb-6 leading-none">
              Explore Fitora's <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00ff94] to-emerald-400">Core Tech</span>
            </h1>
            <p className="text-gray-400 text-base sm:text-lg leading-relaxed font-medium">
              We leverage advanced personalization models to build perfect workout protocols and nutritional schedules specifically tailored to your body.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
            {coreFeatures.map((feat, index) => {
              const IconComp = feat.icon;
              return (
                <div 
                  key={index} 
                  className="bg-[#0d1f17]/95 border border-white/5 p-8 rounded-[2.5rem] group hover:border-[#00ff94]/30 hover:bg-[#0f241a]/95 transition-all duration-500 relative overflow-hidden flex flex-col justify-between"
                  style={{ boxShadow: `0 20px 40px rgba(0, 0, 0, 0.2)` }}
                >
                  {/* Subtle card glow */}
                  <div 
                    className="absolute -top-16 -left-16 w-32 h-32 rounded-full blur-3xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700" 
                    style={{ backgroundColor: feat.glowColor }}
                  />

                  <div>
                    <div className={`w-14 h-14 bg-gradient-to-br ${feat.color} rounded-2xl flex items-center justify-center text-black shadow-lg mb-8 group-hover:scale-110 transition-transform duration-500`}>
                      <IconComp size={24} strokeWidth={2.5} />
                    </div>
                    <h3 className="text-2xl font-black italic uppercase tracking-tight mb-4 text-white group-hover:text-[#00ff94] transition-colors">
                      {feat.title}
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed mb-6 font-medium">
                      {feat.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-white/5 flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-[#00ff94] opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    Discover Tech <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Banner CTA */}
          <div className="bg-gradient-to-r from-[#0d1f17] to-[#122b20] border border-[#00ff94]/20 p-10 md:p-16 rounded-[3rem] text-center max-w-4xl mx-auto shadow-2xl relative overflow-hidden">
            <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-[#00ff94]/5 blur-[80px] pointer-events-none" />
            <h2 className="text-3xl md:text-4xl font-black uppercase italic tracking-tighter mb-4">
              Get Started with <span className="text-[#00ff94]">Fitora Pro</span> Today
            </h2>
            <p className="text-gray-400 text-sm md:text-base max-w-xl mx-auto mb-8 font-medium leading-relaxed">
              Unlock the full potential of machine-learning training protocols, custom diets, and priority live booking.
            </p>
            <button 
              onClick={() => navigate('/register')}
              className="bg-[#00ff94] text-[#0d1f17] px-8 py-4 rounded-full font-black uppercase text-sm italic hover:scale-105 transition-all shadow-lg hover:shadow-[#00ff94]/20"
            >
              Initialize Onboarding
            </button>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FeaturesPage;
