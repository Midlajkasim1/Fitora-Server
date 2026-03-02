import {
    ActivityIcon,
    CalendarIcon,
    CheckCircleIcon,
    FileTextIcon,
    PlayCircleIcon, StarIcon,
    UtensilsIcon
} from 'lucide-react';
import React, { useEffect } from 'react';
import { Footer } from '../../layout/Footer';
import { Header } from '../../layout/Header';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/use-auth-store';

const LandingPage: React.FC = () => {
  const problems = [
    { icon: CalendarIcon, title: 'Inconsistent Routine', description: "Struggling to find the time or motivation to stick to a plan that doesn't adapt to you." },
    { icon: UtensilsIcon, title: 'Confusing Diet Plans', description: 'Overwhelmed by conflicting nutrition information and calorie counting.' },
    { icon: FileTextIcon, title: 'Generic Advice', description: 'Following cookie-cutter programs that ignore your unique physiology and goals.' },
  ];
const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();

useEffect(() => {
  if (isAuthenticated && user?.role === "admin") {
    navigate("/admin/dashboard", { replace: true });
  }

  if (isAuthenticated && user?.role === "user" && !user?.isOnboardingRequired) {
    navigate("/home", { replace: true });
  }
}, [isAuthenticated, user, navigate]);
  const coachFeatures = [
    'Dynamic workout adjustments', 'Real-time form correction', 'Nutrition integration', 'Sleep & recovery analysis',
  ];

  return (
    <div className="min-h-screen w-full bg-[#0a1810] selection:bg-[#00ff94] selection:text-[#0d1f17] font-sans overflow-x-hidden">
      <Header />
      
      <main>
        <section className="pt-24 md:pt-32 pb-12 md:pb-16 px-4 md:px-6">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-[#00ff94]/10 border border-[#00ff94]/30 rounded-full px-4 py-2 mb-6 md:mb-8">
                <span className="w-2 h-2 bg-[#00ff94] rounded-full animate-pulse"></span>
                <span className="text-[#00ff94] text-[10px] md:text-xs font-bold uppercase tracking-widest">AI-Powered Fitness 2.0</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-[1.1] mb-6 italic">
                Maximize Potential with <br />
                <span className="text-[#00ff94]">AI-Powered</span> <br />
                Fitness Excellence!
              </h1>

              <p className="text-gray-400 text-base md:text-lg max-w-md mx-auto lg:mx-0 mb-8 leading-relaxed">
                Stop guessing. Start progressing. Get personalized workouts, form feedback, and data-driven results tailored to your physiology.
              </p>

              <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 mb-10">
                <button className="bg-[#00ff94] text-[#0d1f17] px-8 py-4 rounded-full font-bold hover:shadow-[0_0_20px_rgba(0,255,148,0.3)] transition-all w-full sm:w-auto">
                  Start Your Journey
                </button>
                <button className="flex items-center justify-center gap-2 text-white border border-white/20 px-6 py-4 rounded-full hover:bg-white/5 transition-all w-full sm:w-auto">
                  <PlayCircleIcon className="w-5 h-5" /> See How It Works
                </button>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="flex -space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-emerald-600 border-2 border-[#0a1810]"></div>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00ff94] to-emerald-900 border-2 border-[#0a1810]"></div>
                  <div className="w-10 h-10 rounded-full bg-white/20 border-2 border-[#0a1810]"></div>
                </div>
                <div className="text-center sm:text-left">
                  <p className="text-white text-sm font-bold">Joined by 10,000+ athletes</p>
                  <div className="flex justify-center sm:justify-start gap-0.5">
                    {[...Array(5)].map((_, i) => (<StarIcon key={i} className="w-3.5 h-3.5 fill-[#00ff94] text-[#00ff94]" />))}
                  </div>
                </div>
              </div>
            </div>

            <div className="relative group mt-8 lg:mt-0">
              <div className="absolute -inset-1 bg-[#00ff94]/20 rounded-3xl blur-xl group-hover:bg-[#00ff94]/30 transition-all"></div>
              <div className="relative rounded-2xl overflow-hidden bg-[#1a2e23] border border-white/10 shadow-2xl">
                <img src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80" alt="Training" className="w-full h-[350px] md:h-[500px] object-cover opacity-70 group-hover:scale-105 transition-transform duration-1000" />
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 bg-gradient-to-t from-[#0d1f17] to-transparent flex justify-between items-end">
                  <div><p className="text-gray-400 text-[10px] md:text-xs font-bold uppercase mb-1">Current Pace</p><p className="text-white text-2xl md:text-3xl font-black italic">4:32 / km</p></div>
                  <div className="text-right"><p className="text-gray-400 text-[10px] md:text-xs font-bold uppercase mb-1">Heart Rate</p><p className="text-[#00ff94] text-2xl md:text-3xl font-black italic">142 BPM</p></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PROBLEMS SECTION - Stacks on mobile */}
        <section id="features" className="py-12 md:py-16 px-4 md:px-6 bg-[#0d1f17]/20">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-8">
            <div className="bg-[#0d1f17] p-8 md:p-10 rounded-3xl border border-white/5 shadow-2xl">
              <h3 className="text-xl md:text-2xl font-bold text-white mb-6 italic">Why Can't You Achieve Your Goals?</h3>
              <p className="text-gray-400 leading-relaxed text-base md:text-lg mb-8">The old way is broken. Generic PDFs and random YouTube videos don't account for your unique body, schedule, or progress.</p>
              <div className="w-16 h-1 bg-[#00ff94]"></div>
            </div>
            <div className="space-y-4">
              {problems.map((p, i) => (
                <div key={i} className="bg-[#1a2e23]/50 border border-white/5 p-5 md:p-6 rounded-2xl flex flex-col sm:flex-row gap-4 sm:gap-6 hover:border-[#00ff94]/30 transition-all group">
                  <div className="w-12 h-12 shrink-0 bg-[#0d1f17] rounded-xl flex items-center justify-center group-hover:bg-[#00ff94] transition-colors">
                    <p.icon className="w-6 h-6 text-[#00ff94] group-hover:text-black" />
                  </div>
                  <div><h4 className="text-white font-bold text-lg mb-2">{p.title}</h4><p className="text-gray-400 text-sm leading-relaxed">{p.description}</p></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* STATS SECTION - Grid columns adjust based on screen size */}
        <section className="py-12 px-4 md:px-6">
          <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 md:gap-12 text-center">
            <div><p className="text-5xl md:text-6xl font-black text-white mb-2 tracking-tighter">30<span className="text-[#00ff94]">%</span></p><p className="text-gray-500 font-bold uppercase text-[10px] md:text-xs">Faster Results</p></div>
            <div><p className="text-5xl md:text-6xl font-black text-white mb-2 tracking-tighter">24/7</p><p className="text-gray-500 font-bold uppercase text-[10px] md:text-xs">AI Coach Access</p></div>
            <div><p className="text-5xl md:text-6xl font-black text-white mb-2 tracking-tighter">1M<span className="text-[#00ff94]">+</span></p><p className="text-gray-500 font-bold uppercase text-[10px] md:text-xs">Workouts Generated</p></div>
          </div>
        </section>

        {/* AI COACH SECTION - Responsive flex and text alignment */}
        <section className="py-12 md:py-16 px-4 md:px-6 bg-gradient-to-b from-transparent to-[#0d1f17]/40">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="flex flex-col items-center">
              <div className="relative w-64 h-64 md:w-80 md:h-80 mb-8 bg-[#1a2e23] rounded-full flex items-center justify-center p-6 border border-white/5">
                <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="46" fill="none" stroke="#0d1f17" strokeWidth="8" />
                  <circle cx="50" cy="50" r="46" fill="none" stroke="#00ff94" strokeWidth="8" strokeDasharray="289" strokeDashoffset="80" strokeLinecap="round" />
                </svg>
                <div className="text-center z-10">
                  <ActivityIcon className="w-8 h-8 md:w-10 md:h-10 text-[#00ff94] mx-auto mb-2" />
                  <p className="text-5xl md:text-6xl font-black text-white italic">152</p>
                  <p className="text-gray-400 font-bold uppercase text-[10px] md:text-xs">Heart Rate</p>
                </div>
              </div>
              <div className="bg-[#1a2e23] border border-white/10 rounded-2xl p-5 md:p-6 w-full max-w-sm flex justify-between items-center">
                 <div className="space-y-1"><p className="text-[#00ff94] text-[10px] md:text-xs font-bold italic uppercase tracking-widest">Live Analysis</p><p className="text-white text-base md:text-lg font-bold">84% Recovery</p></div>
                 <div className="w-2 h-2 bg-[#00ff94] rounded-full animate-ping"></div>
              </div>
            </div>

            <div className="space-y-6 text-center lg:text-left">
              <h2 className="text-4xl md:text-5xl font-black text-white italic">Your Personal <span className="text-[#00ff94]">AI Coach</span></h2>
              <p className="text-gray-400 text-base md:text-lg">Experience adaptive training, injury prevention, and smart analytics designed just for you.</p>
              <ul className="space-y-3 inline-block lg:block text-left">
                {coachFeatures.map((f, i) => (<li key={i} className="flex items-center gap-4 text-white font-medium text-sm md:text-base"><CheckCircleIcon className="w-5 h-5 text-[#00ff94]" /> {f}</li>))}
              </ul>
              <div className="pt-4">
                <button className="text-white border-2 border-white/10 px-8 py-4 rounded-full font-bold hover:bg-white/5 transition-all w-full sm:w-auto">Learn How It Works</button>
              </div>
            </div>
          </div>
        </section>

        {/* CTA SECTION - Full width padding on mobile */}
        <section className="py-16 md:py-20 px-4 md:px-6">
          <div className="max-w-4xl mx-auto text-center bg-[#0d1f17] py-12 md:py-16 px-6 md:px-10 rounded-[2rem] md:rounded-[3rem] border border-[#00ff94]/20">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4 italic">Ready to Transform?</h2>
            <p className="text-gray-400 text-base md:text-lg mb-8 max-w-xl mx-auto">Join thousands of users who have unlocked their peak performance with AI Fitness.</p>
            <button className="bg-[#00ff94] text-[#0d1f17] px-10 md:px-12 py-4 md:py-5 rounded-full font-black text-base md:text-lg hover:scale-105 transition-all shadow-xl w-full sm:w-auto">Start Your Journey Now</button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default LandingPage;