import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../../layout/Header';
import { Footer } from '../../layout/Footer';
import { Check, X, ShieldCheck, HelpCircle } from 'lucide-react';

const PricingPage: React.FC = () => {
  const navigate = useNavigate();

  const plans = [
    {
      name: "Starter Trial",
      price: "₹0",
      period: "forever",
      description: "Perfect for beginners looking to start their fitness journey and explore baseline metrics.",
      features: [
        { text: "Access to Standard Workouts", available: true },
        { text: "Basic Health Metrics Log", available: true },
        { text: "Free Trial Dashboard", available: true },
        { text: "AI-Generated Custom Workouts", available: false },
        { text: "AI-Generated Personalized Diets", available: false },
        { text: "Live Video Sessions Booking", available: false },
        { text: "24/7 AI Coach Assistant Access", available: false }
      ],
      buttonText: "Create Free Account",
      isPopular: false,
      buttonAction: () => navigate('/register')
    },
    {
      name: "Pro Performance",
      price: "₹999",
      period: "per month",
      description: "Unleash elite training with complete machine learning workout modifications and diet planners.",
      features: [
        { text: "Access to Standard Workouts", available: true },
        { text: "Basic Health Metrics Log", available: true },
        { text: "Pro Interactive Dashboard", available: true },
        { text: "AI-Generated Custom Workouts", available: true },
        { text: "AI-Generated Personalized Diets", available: true },
        { text: "Live Video Sessions Booking", available: true },
        { text: "24/7 AI Coach Assistant Access", available: true }
      ],
      buttonText: "Go Pro Performance",
      isPopular: true,
      buttonAction: () => navigate('/register')
    }
  ];

  return (
    <div className="min-h-screen w-full bg-[#0a1810] selection:bg-[#00ff94] selection:text-[#0d1f17] font-sans overflow-x-hidden text-white">
      <Header />

      <main className="relative pt-32 pb-24 px-4 sm:px-6 lg:px-8">
        {/* Background glow effects */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00ff94]/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10">
          
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-20">
            <div className="inline-flex items-center gap-2 bg-[#00ff94]/10 border border-[#00ff94]/20 rounded-full px-4 py-2 mb-6">
              <ShieldCheck size={14} className="text-[#00ff94]" />
              <span className="text-[#00ff94] text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em]">Secure Checkout & Guarantee</span>
            </div>
            <h1 className="text-4xl sm:text-6xl font-black italic tracking-tighter uppercase mb-6 leading-none">
              Simple, <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00ff94] to-emerald-400">Transparent</span> Pricing
            </h1>
            <p className="text-gray-400 text-base sm:text-lg leading-relaxed font-medium">
              Choose the protocol that fits your performance level. Upgrade, downgrade, or cancel your subscription at any time.
            </p>
          </div>

          {/* Pricing Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-24">
            {plans.map((plan, index) => (
              <div 
                key={index} 
                className={`rounded-[3rem] p-8 sm:p-12 relative overflow-hidden flex flex-col justify-between border ${
                  plan.isPopular 
                    ? 'bg-[#0e2419] border-[#00ff94]/40 shadow-[0_0_50px_rgba(0,255,148,0.1)]' 
                    : 'bg-[#0d1f17]/95 border-white/5 shadow-2xl'
                }`}
              >
                {/* Popular Badge */}
                {plan.isPopular && (
                  <div className="absolute top-6 right-6 bg-[#00ff94] text-[#0d1f17] px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest italic">
                    Best Value
                  </div>
                )}

                <div>
                  <h3 className="text-xl sm:text-2xl font-black uppercase italic tracking-wider text-gray-400 mb-2">
                    {plan.name}
                  </h3>
                  
                  <div className="flex items-baseline gap-2 mb-6">
                    <span className="text-5xl sm:text-6xl font-black italic text-white tracking-tighter">{plan.price}</span>
                    <span className="text-xs text-gray-500 font-bold uppercase tracking-widest">/ {plan.period}</span>
                  </div>

                  <p className="text-gray-400 text-sm leading-relaxed mb-8 font-medium">
                    {plan.description}
                  </p>

                  <div className="w-full h-[1px] bg-white/5 mb-8" />

                  {/* Features Checklist */}
                  <ul className="space-y-4 mb-10">
                    {plan.features.map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-4">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                          feat.available ? 'bg-[#00ff94]/10 text-[#00ff94]' : 'bg-white/5 text-gray-600'
                        }`}>
                          {feat.available ? <Check size={12} strokeWidth={3} /> : <X size={12} strokeWidth={3} />}
                        </div>
                        <span className={`text-sm font-medium ${feat.available ? 'text-gray-300' : 'text-gray-600 line-through'}`}>
                          {feat.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button 
                  onClick={plan.buttonAction}
                  className={`w-full py-4 rounded-2xl font-black uppercase tracking-wider text-sm italic transition-all duration-300 ${
                    plan.isPopular 
                      ? 'bg-[#00ff94] text-[#0d1f17] hover:shadow-[0_0_30px_rgba(0,255,148,0.4)] hover:scale-[1.02]' 
                      : 'bg-white/5 text-white hover:bg-white/10 hover:border-white/10 border border-white/5'
                  }`}
                >
                  {plan.buttonText}
                </button>
              </div>
            ))}
          </div>

          {/* FAQ Minimal Section */}
          <div className="max-w-4xl mx-auto bg-[#0d1f17] border border-white/5 rounded-[3rem] p-8 sm:p-12">
            <h2 className="text-2xl sm:text-3xl font-black uppercase italic tracking-tight mb-8 text-center flex items-center justify-center gap-3">
              <HelpCircle className="text-[#00ff94]" /> Frequently Asked Questions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-white font-bold text-base mb-2 italic">How does the billing work?</h4>
                <p className="text-gray-400 text-xs sm:text-sm leading-relaxed font-medium">
                  We process secure monthly payments through Stripe. You will be billed exactly ₹999 on the same day every month. Cancel anytime.
                </p>
              </div>
              <div>
                <h4 className="text-white font-bold text-base mb-2 italic">What is the AI Coach?</h4>
                <p className="text-gray-400 text-xs sm:text-sm leading-relaxed font-medium">
                  The AI Coach is a 24/7 LLM assistant designed to answer your exercise, dietary, and scheduling questions instantly based on your logged metrics.
                </p>
              </div>
              <div>
                <h4 className="text-white font-bold text-base mb-2 italic">Can I switch plans later?</h4>
                <p className="text-gray-400 text-xs sm:text-sm leading-relaxed font-medium">
                  Yes, you can easily change or cancel your subscription plan directly from your client settings panel with a single click.
                </p>
              </div>
              <div>
                <h4 className="text-white font-bold text-base mb-2 italic">Are trainer sessions included?</h4>
                <p className="text-gray-400 text-xs sm:text-sm leading-relaxed font-medium">
                  The Pro Performance plan grants access to book scheduling tools. However, individual trainer session costs are set by the independent trainers.
                </p>
              </div>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PricingPage;
