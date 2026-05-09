import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Dumbbell, Utensils, Plus, Lock } from 'lucide-react';
import { AiStatItem } from '../../../../components/user/ai-workout&diet/AiStatItem';
import { useSubscriptionStatus } from '../../../../hooks/user/subscription/check-plan-status';
import { toast } from 'react-hot-toast';
import { GlobalLoader } from '../../../../shared/GlobalLoader';

const AiSelectionPage = () => {
  const navigate = useNavigate();
  const { data: statusData, isLoading: isStatusLoading } = useSubscriptionStatus();
  
  const hasAiWorkout = statusData?.subscription?.hasAiWorkout || false;
  const hasAiDiet = statusData?.subscription?.hasAiDiet || false;

  if (isStatusLoading) return <GlobalLoader />;

  const handleDietClick = () => {
    if (hasAiDiet) {
      navigate('/ai-diet');
    } else {
      toast.error('AI Diet planning is not included in your current plan. Upgrade to unlock!', {
        icon: '🔒',
        style: {
          borderRadius: '15px',
          background: '#0d1f17',
          color: '#fff',
          border: '1px solid rgba(0, 255, 148, 0.2)',
          fontSize: '12px',
          fontWeight: 'bold',
          textTransform: 'uppercase'
        },
      });
    }
  };

  const handleWorkoutClick = () => {
    if (hasAiWorkout) {
      navigate('/ai-workout');
    } else {
      toast.error('AI Workout planning is not included in your current plan. Upgrade to unlock!', {
        icon: '🔒',
        style: {
          borderRadius: '15px',
          background: '#0d1f17',
          color: '#fff',
          border: '1px solid rgba(0, 255, 148, 0.2)',
          fontSize: '12px',
          fontWeight: 'bold',
          textTransform: 'uppercase'
        },
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#05110B] text-white selection:bg-[#00ff94]/30 flex items-center p-6 md:p-12 lg:p-16 relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-200px] left-[-200px] w-[600px] h-[600px] bg-[#00ff94]/5 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-200px] right-[-200px] w-[500px] h-[500px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto w-full flex flex-col lg:flex-row items-center gap-12 lg:gap-24 relative z-10">
        
        <div className="flex-1 space-y-10 text-center lg:text-left">
          <div className="flex justify-center lg:justify-start">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-[#00ff94]/20 text-[#00ff94] text-[10px] font-black tracking-[0.3em] uppercase italic">
              <span className="w-2 h-2 rounded-full bg-[#00ff94] animate-pulse shadow-[0_0_10px_#00ff94]"></span>
              Universal AI Protocol
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-[0.9] tracking-tighter uppercase italic">
            Achieve Your <br /> 
            <span className="text-[#00ff94] bg-white px-3 not-italic">Elite</span> <br /> 
            Fitness Goals
          </h1>

          <p className="text-gray-500 max-w-md mx-auto lg:mx-0 text-lg font-bold italic uppercase tracking-tight leading-relaxed">
            Harness the power of machine learning to optimize every set and every calorie.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
            <SelectionCard 
              icon={hasAiWorkout ? <Dumbbell size={28} strokeWidth={2.5} /> : <Lock size={28} strokeWidth={2.5} />}
              title="Workout"
              subtitle={hasAiWorkout ? "Daily routines" : "Plan Lock"}
              isLocked={!hasAiWorkout}
              onClick={handleWorkoutClick}
            />
            <SelectionCard 
              icon={hasAiDiet ? <Utensils size={28} strokeWidth={2.5} /> : <Lock size={28} strokeWidth={2.5} />}
              title="Diet Plan"
              subtitle={hasAiDiet ? "Smart nutrition" : "Plan Lock"}
              isLocked={!hasAiDiet}
              onClick={handleDietClick}
            />
          </div>

          <div className="flex justify-center lg:justify-start gap-12 md:gap-20 pt-10 border-t border-white/5">
            <AiStatItem label="Precision" value="100%" />
            <AiStatItem label="Uptime" value="24/7" />
            <AiStatItem label="Tokens" value="512K" />
          </div>
        </div>

        <div className="flex-1 relative w-full hidden lg:block">
          <div className="relative group">
            <div className="absolute -inset-4 bg-[#00ff94]/10 rounded-[3rem] blur-2xl opacity-50 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl">
              <img 
                src="https://jimmyjrichard.com/wp-content/uploads/2024/08/Create-a-futuristic-gym-setting-where-advanced-AI-technology-is-integrated-into-every-aspect-of-the-workout.-Picture-a-muscular-individual-lifting-weights-with-holographic-AI-displays-guiding-the.png" 
                className="w-full h-auto object-cover aspect-[4/5] grayscale hover:grayscale-0 transition-all duration-1000 scale-105 group-hover:scale-100" 
                alt="AI Gym" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#05110B] via-transparent to-transparent opacity-60"></div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

const SelectionCard = ({ icon, title, subtitle, onClick, isLocked }: { icon: React.ReactNode; title: string; subtitle: string; onClick: () => void; isLocked?: boolean }) => (
  <button 
    onClick={onClick} 
    className={`group flex items-center text-left gap-6 p-6 rounded-3xl border transition-all duration-500 relative overflow-hidden ${
      isLocked 
        ? 'bg-white/[0.02] border-white/5 opacity-50 gray-scale' 
        : 'bg-[#0A1A12] border-white/5 hover:border-[#00ff94]/40 hover:translate-y-[-5px] shadow-2xl'
    }`}
  >
    <div className={`w-16 h-16 shrink-0 rounded-2xl flex items-center justify-center transition-all duration-500 ${
      isLocked 
        ? 'bg-black/40 text-gray-700' 
        : `bg-[#00ff94]/10 text-[#00ff94] group-hover:bg-[#00ff94] group-hover:text-black group-hover:rotate-6 shadow-inner border border-white/5`
    }`}>
      {icon}
    </div>
    <div className="flex-1">
      <h3 className="text-xl font-black text-white italic tracking-tight group-hover:text-[#00ff94] transition-colors leading-none flex items-center gap-2">
        {title}
      </h3>
      <p className="text-gray-600 text-[10px] font-black uppercase tracking-[0.2em] mt-2 italic">{subtitle}</p>
    </div>
    {!isLocked && (
      <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-700 group-hover:bg-[#00ff94]/20 group-hover:text-[#00ff94] transition-all">
         <Plus size={16} strokeWidth={3} />
      </div>
    )}
  </button>
);

export default AiSelectionPage;