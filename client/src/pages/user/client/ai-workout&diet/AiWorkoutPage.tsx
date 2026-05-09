import React, { useState } from "react";
import { ArrowLeft, Calendar, ChevronDown, ChevronUp, Clock, Dumbbell, Flame, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useGenerateWorkout, useWorkoutPlan } from "../../../../hooks/user/ai-workout&plan/use-ai-generate";
import { PromptInput } from "../../../../components/user/ai-workout&diet/PromptInput";
import type { WorkoutDay } from "../../../../type/user.types";
import { useSubscriptionStatus } from "../../../../hooks/user/subscription/check-plan-status";
import { GlobalLoader } from "../../../../shared/GlobalLoader";

const AiWorkoutPage = () => {
  const navigate = useNavigate();

  const { data: statusData, isLoading: isStatusLoading } = useSubscriptionStatus();

  // 1. Fetch existing plan automatically
  const { data: existingData, isLoading: isFetching } = useWorkoutPlan();

  // 2. Setup mutation for generating new plan
  const { mutate: generate, isPending: isGenerating } = useGenerateWorkout();

  const hasAiWorkout = statusData?.subscription?.hasAiWorkout || false;

  if (isStatusLoading || isFetching) return <GlobalLoader />;

  if (!hasAiWorkout) {
    navigate('/ai-selection');
    return null;
  }

  const handleGenerate = () => {
    generate({ metrics: { days: 7 } });
  };

  // Combine loading states
  const isBusy = isFetching || isGenerating;
  // Use data from either source
  const planData = (existingData as any)?.data || existingData;

  return (
    <div className="min-h-screen bg-[#05110B] text-white p-6 md:p-12 font-sans pt-28 selection:bg-[#00ff94] selection:text-black">
      <div className="max-w-6xl mx-auto relative">
        {/* Decorative Background Glows */}
        <div className="absolute top-[-100px] right-[-100px] w-96 h-96 bg-[#00ff94]/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[-100px] left-[-100px] w-80 h-80 bg-orange-500/5 blur-[100px] rounded-full pointer-events-none" />

        <header className="mb-12 relative z-10">
          <button onClick={() => navigate('/ai-selection')} className="group flex items-center gap-2 text-gray-500 hover:text-[#00ff94] transition-all mb-6 uppercase text-[10px] font-black tracking-[0.2em] italic">
            <div className="p-2 bg-white/5 rounded-lg group-hover:bg-[#00ff94]/10 transition-colors">
               <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            </div>
            Back to AI Selection
          </button>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-5xl md:text-7xl font-black mb-3 uppercase italic tracking-tighter text-white leading-none">
                AI <span className="text-gray-900 bg-white px-2">Training</span> Protocol
              </h1>
              <p className="text-gray-500 text-xs font-bold uppercase tracking-[0.3em] flex items-center gap-2 italic">
                <span className="w-2 h-2 rounded-full bg-[#00ff94] animate-pulse shadow-[0_0_10px_#00ff94]"></span>
                Machine-learning optimized workload adjustments
              </p>
            </div>
            <div className="hidden md:block">
               <div className="flex items-center gap-4 bg-white/5 backdrop-blur-md border border-white/5 p-4 rounded-3xl">
                  <div className="w-10 h-10 bg-[#00ff94]/10 rounded-xl flex items-center justify-center text-[#00ff94]">
                     <Zap size={20} />
                  </div>
                  <div>
                     <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest leading-none">Intensity</p>
                     <p className="text-[11px] font-black uppercase text-white tracking-widest mt-1">High Performance</p>
                  </div>
               </div>
            </div>
          </div>
        </header>

        <section className="mb-20">
          <PromptInput title="Workout" onGenerate={handleGenerate} isPending={isBusy} />
        </section>

        {planData?.success && planData?.weeklyPlan?.length > 0 ? (
          <div className="space-y-24 relative z-10">
            {planData.weeklyPlan.map((dayPlan: any, idx: number) => (
              <WorkoutDayAccordion key={idx} day={dayPlan} isDefaultOpen={idx === 0} />
            )) || <p>No weekly plan available</p>}
          </div>
        ) : (
          !isBusy && (
            <div className="py-32 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-[4rem] text-center px-8 bg-gradient-to-b from-white/[0.02] to-transparent">
              <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center text-gray-600 mb-8 border border-white/5 shadow-inner">
                <Dumbbell size={32} />
              </div>
              <h2 className="text-2xl font-black italic uppercase text-white/40 tracking-tighter mb-4 leading-none">System Inactive</h2>
              <p className="text-gray-600 max-w-sm text-[11px] font-bold uppercase tracking-[0.2em] italic leading-relaxed">
                Connect your AI driver to build a comprehensive training schedule.
              </p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

const WorkoutDayAccordion = ({ day, isDefaultOpen }: { day: WorkoutDay; isDefaultOpen?: boolean }) => {
  const [isOpen, setIsOpen] = useState(isDefaultOpen);

  return (
    <div className={`transition-all duration-700 ${isOpen ? 'space-y-8' : ''}`}>
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className={`w-full group flex items-center justify-between p-8 md:p-10 rounded-[2.5rem] border transition-all duration-500 relative overflow-hidden ${
          isOpen 
            ? 'bg-[#0A1A12] border-[#00ff94]/30 shadow-[0_0_50px_rgba(0,255,148,0.05)]' 
            : 'bg-[#0A1A12]/30 border-white/5 hover:border-white/10'
        }`}
      >
        {isOpen && <div className="absolute top-0 right-0 w-64 h-64 bg-[#00ff94]/5 blur-[80px] pointer-events-none" />}
        
        <div className="flex flex-wrap items-center gap-x-12 gap-y-4 relative z-10">
          <div className="flex items-center gap-6">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 ${
              isOpen ? 'bg-[#00ff94] text-black shadow-[0_10px_20px_rgba(0,255,148,0.2)]' : 'bg-white/5 text-[#00ff94]'
            }`}>
              <Calendar size={24} strokeWidth={3} />
            </div>
            <div>
              <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest leading-none mb-1 block italic">{day.day} Session</span>
              <span className="text-3xl font-black text-white uppercase italic tracking-tighter">{day.focus || "Total Body"}</span>
            </div>
          </div>
          
          <div className="flex gap-4">
            <Badge icon={<Clock size={12} />} text="45 MIN" active={isOpen} />
            <Badge icon={<Flame size={12} />} text="350+ KCAL" active={isOpen} />
          </div>
        </div>

        <div className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all duration-500 relative z-10 ${
          isOpen ? 'bg-white text-black border-white' : 'border-white/10 text-gray-500 group-hover:border-white/30'
        }`}>
          {isOpen ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
        </div>
      </button>

      {isOpen && (
        <div className="animate-in fade-in slide-in-from-top-4 duration-700 space-y-12">
          {day.warmup && (
            <div className="mx-4 p-6 bg-[#00ff94]/5 rounded-[2rem] border border-[#00ff94]/10 flex items-start gap-5 backdrop-blur-sm">
              <div className="p-3 bg-[#00ff94]/10 rounded-xl text-[#00ff94]">
                 <Zap size={20} />
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-black text-[#00ff94] uppercase tracking-[0.3em] mb-2 italic">Activation Sequence</p>
                <p className="text-sm text-gray-400 font-medium leading-relaxed italic pr-4">
                   {day.warmup}
                </p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mx-4">
            {day.exercises.map((ex, i) => (
              <ExerciseCard key={i} ex={ex} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const ExerciseCard = ({ ex }: { ex: any }) => (
  <div className="bg-[#0A1A12] border border-white/5 rounded-[3rem] p-8 group hover:border-[#00ff94]/40 hover:bg-[#0E2419] transition-all duration-500 flex items-center gap-6 shadow-2xl relative overflow-hidden">
     <div className="absolute top-0 right-0 w-32 h-32 bg-[#00ff94]/5 blur-3xl pointer-events-none" />
     
     <div className="w-16 h-16 bg-black/40 rounded-2xl flex items-center justify-center text-[#00ff94] border border-white/5 group-hover:scale-110 group-hover:bg-[#00ff94] group-hover:text-black transition-all">
        <Dumbbell size={28} />
     </div>
     
     <div className="flex-1 min-w-0 relative z-10">
        <div className="flex items-center justify-between mb-1">
           <h4 className="text-lg font-black text-white uppercase italic tracking-tight group-hover:text-[#00ff94] transition-colors truncate pr-4">{ex.name}</h4>
           <div className="bg-[#00ff94]/10 px-3 py-1 rounded-lg">
              <span className="text-[10px] font-black text-[#00ff94] italic">{ex.sets}x{ex.reps}</span>
           </div>
        </div>
        <p className="text-[10px] text-gray-500 font-bold italic line-clamp-1 border-l border-white/10 pl-3">"{ex.notes || "Explosive movement"}"</p>
        
        <div className="mt-4 flex items-center gap-4">
           <div className="flex items-center gap-1.5">
              <Clock size={12} className="text-gray-600" />
              <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none">{ex.restTime} Rest</span>
           </div>
        </div>
     </div>
  </div>
);

const Badge = ({ icon, text, active }: { icon: React.ReactNode; text: string; active?: boolean }) => (
  <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-[10px] font-black tracking-widest border transition-all duration-500 ${
    active 
      ? "bg-white text-black border-white italic" 
      : "bg-white/5 text-gray-500 border-white/5 uppercase"
  }`}>
    {icon} {text}
  </div>
);

export default AiWorkoutPage;