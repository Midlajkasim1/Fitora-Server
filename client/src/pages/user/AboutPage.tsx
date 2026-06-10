import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../../layout/Header';
import { Footer } from '../../layout/Footer';
import { ShieldCheck, Heart, Award, Users, Target } from 'lucide-react';

const AboutPage: React.FC = () => {
  const navigate = useNavigate();

  const values = [
    {
      icon: Target,
      title: "Visionary Tech",
      description: "We believe in leveraging data and artificial intelligence to design hyper-personalized schedules, removing guesswork and building peak performance."
    },
    {
      icon: Users,
      title: "Human Synergy",
      description: "Technology shouldn't replace human experience. We connect verified fitness trainers with clients worldwide through custom audio/video training slots."
    },
    {
      icon: ShieldCheck,
      title: "Absolute Safety",
      description: "Your health is paramount. We vet onboarding details and parameters strictly to generate injury-free, sustainable, and progressive training routines."
    },
    {
      icon: Award,
      title: "Elite Excellence",
      description: "We are committed to delivering premium-grade designs, seamless user interactions, and robust performance optimization on every screen."
    }
  ];

  return (
    <div className="min-h-screen w-full bg-[#0a1810] selection:bg-[#00ff94] selection:text-[#0d1f17] font-sans overflow-x-hidden text-white">
      <Header />

      <main className="relative pt-32 pb-24 px-4 sm:px-6 lg:px-8">
        {/* Glow decoration */}
        <div className="absolute top-1/3 left-0 w-[400px] h-[400px] bg-[#00ff94]/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-1/3 right-0 w-[400px] h-[400px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10">
          
          {/* Main Title Section */}
          <div className="text-center max-w-3xl mx-auto mb-20">
            <div className="inline-flex items-center gap-2 bg-[#00ff94]/10 border border-[#00ff94]/20 rounded-full px-4 py-2 mb-6">
              <Heart size={14} className="text-[#00ff94]" />
              <span className="text-[#00ff94] text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em]">Our DNA & Heritage</span>
            </div>
            <h1 className="text-4xl sm:text-6xl font-black italic tracking-tighter uppercase mb-6 leading-none">
              Revolutionizing <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00ff94] to-emerald-400">Fitness Protocols</span>
            </h1>
            <p className="text-gray-400 text-base sm:text-lg leading-relaxed font-medium">
              Fitora was founded with a singular mission: to democratize high-level athletic coaching by combining state-of-the-art AI with elite professional trainers.
            </p>
          </div>

          {/* Mission and Vision Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-24">
            <div className="relative rounded-[3rem] overflow-hidden border border-white/5 shadow-2xl bg-[#0d1f17]">
              <img 
                src="https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&q=80" 
                alt="Fitness team" 
                className="w-full h-[350px] md:h-[450px] object-cover opacity-60 hover:scale-105 transition-transform duration-1000" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a1810] via-transparent to-transparent" />
            </div>

            <div className="space-y-8">
              <h2 className="text-3xl sm:text-4xl font-black uppercase italic tracking-tight text-white leading-none">
                Empowering Athletes <span className="text-[#00ff94]">Globally</span>
              </h2>
              <p className="text-gray-400 text-sm sm:text-base leading-relaxed font-medium">
                Whether you are starting your fitness journey or training for elite competition, Fitora adapts to your lifestyle. By analyzing weekly health metrics and nutrition inputs, our neural driver optimizes your weekly plan dynamically.
              </p>
              <p className="text-gray-400 text-sm sm:text-base leading-relaxed font-medium">
                We bridge the gap between expensive personal training services and automated app experiences. Our trainer marketplace lets certified coaches schedule custom slots and connect directly via virtual video rooms.
              </p>
              
              <div className="flex gap-8 border-t border-white/5 pt-8">
                <div>
                  <span className="text-4xl font-black text-white italic tracking-tighter block mb-1">10k+</span>
                  <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Active Athletes</span>
                </div>
                <div>
                  <span className="text-4xl font-black text-[#00ff94] italic tracking-tighter block mb-1">99.8%</span>
                  <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Success Rate</span>
                </div>
                <div>
                  <span className="text-4xl font-black text-white italic tracking-tighter block mb-1">1M+</span>
                  <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Plans Built</span>
                </div>
              </div>
            </div>
          </div>

          {/* Core Values Section */}
          <div className="mb-24">
            <h2 className="text-3xl font-black uppercase italic tracking-tight text-center mb-12">
              Our Core <span className="text-[#00ff94]">Values</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {values.map((val, idx) => {
                const Icon = val.icon;
                return (
                  <div key={idx} className="bg-[#0d1f17]/90 border border-white/5 p-8 rounded-[2.5rem] flex gap-6 hover:border-[#00ff94]/30 transition-all duration-300">
                    <div className="w-12 h-12 shrink-0 bg-[#00ff94]/10 rounded-xl flex items-center justify-center text-[#00ff94]">
                      <Icon size={24} />
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-lg mb-2 italic uppercase tracking-wider">{val.title}</h4>
                      <p className="text-gray-400 text-sm leading-relaxed font-medium">{val.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Team CTA */}
          <div className="bg-[#0d1f17] border border-white/5 rounded-[3rem] p-10 md:p-16 text-center max-w-4xl mx-auto shadow-2xl">
            <h2 className="text-3xl md:text-4xl font-black uppercase italic tracking-tighter mb-4">
              Join the <span className="text-[#00ff94]">Fitora Collective</span>
            </h2>
            <p className="text-gray-400 text-sm md:text-base max-w-xl mx-auto mb-8 font-medium leading-relaxed">
              We are constantly onboarding elite trainers and software engineers dedicated to digital health and performance science.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button 
                onClick={() => navigate('/register')}
                className="bg-[#00ff94] text-[#0d1f17] px-8 py-4 rounded-full font-black uppercase text-sm italic hover:scale-105 transition-all shadow-lg"
              >
                Sign Up as Athlete
              </button>
              <button 
                onClick={() => navigate('/register')}
                className="bg-transparent border border-white/10 text-white hover:bg-white/5 px-8 py-4 rounded-full font-black uppercase text-sm italic hover:scale-105 transition-all"
              >
                Apply as Trainer
              </button>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AboutPage;
