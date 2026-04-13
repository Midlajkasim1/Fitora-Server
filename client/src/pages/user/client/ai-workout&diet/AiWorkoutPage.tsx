import React, { useState } from "react";
import { ArrowLeft, Calendar, ChevronDown, ChevronUp, Clock, Dumbbell, Flame, TrendingUp, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useGenerateWorkout, useWorkoutPlan } from "../../../../hooks/user/ai-workout&plan/use-ai-generate";
import { PromptInput } from "../../../../components/user/ai-workout&diet/PromptInput";
import type { WorkoutDay } from "../../../../type/user.types";

const AiWorkoutPage = () => {
  const navigate = useNavigate();

  // 1. Fetch existing plan automatically
  const { data: existingData, isLoading: isFetching } = useWorkoutPlan();

  // 2. Setup mutation for generating new plan
  const { mutate: generate, isPending: isGenerating } = useGenerateWorkout();

  const handleGenerate = () => {
    generate({ metrics: { days: 7 } });
  };

  // Combine loading states
  const isBusy = isFetching || isGenerating;
  // Use data from either source
  const planData = existingData;

  return (
    <div className="min-h-screen bg-[#05110B] text-white p-6 md:p-12 font-sans pt-28">
      <div className="max-w-5xl mx-auto">
        <header className="mb-8">
          <button
            onClick={() => navigate('/ai-selection')}
            className="group flex items-center gap-2 text-gray-500 hover:text-[#00ff94] transition-colors mb-4 uppercase text-[10px] font-black tracking-widest"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back to AI Selection
          </button>
          <h1 className="text-4xl md:text-5xl font-black mb-1 uppercase italic tracking-tighter text-white">our Personal Workout Plan</h1>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00ff94] animate-pulse"></span>
            Custom Training for Your Goals
          </p>
        </header>

        <PromptInput title="Workout" onGenerate={handleGenerate} isPending={isBusy} />

        <div className="space-y-4">
          {planData?.success && planData?.weeklyPlan?.length > 0 ? (
            planData.weeklyPlan.map((dayPlan, idx) => (
              <WorkoutDayAccordion key={idx} day={dayPlan} isDefaultOpen={idx === 0} />
            ))
          ) : (
            !isBusy && (
              <div className="py-24 flex flex-col items-center justify-center border-2 border-dashed border-[#1A2E24] rounded-[3rem] text-center px-8 bg-[#0A1A12]/20">
                <Dumbbell size={32} className="text-gray-700 mb-6" />
                <p className="text-gray-500 max-w-md text-sm font-medium uppercase tracking-widest leading-relaxed">
                  No plan found. Create your weekly schedule to get started.
                </p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

const WorkoutDayAccordion = ({ day, isDefaultOpen }: { day: WorkoutDay; isDefaultOpen?: boolean }) => {
  const [isOpen, setIsOpen] = useState(isDefaultOpen);

  return (
    <div className={`rounded-[2.5rem] border border-[#1A2E24] transition-all duration-500 overflow-hidden ${isOpen ? 'bg-[#0A1A12] border-[#00ff94]/20' : 'bg-[#0A1A12]/40'}`}>
      <button onClick={() => setIsOpen(!isOpen)} className="w-full flex items-center justify-between p-8 text-left">
        <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-black/40 border border-white/5 flex items-center justify-center text-[#00ff94]">
              <Calendar size={20} />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em]">{day.day}</span>
              <span className="text-xl font-black text-white uppercase italic tracking-tight">{day.focus}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Badge icon={<Clock size={12} />} text="45 MIN" />
            <Badge icon={<Flame size={12} />} text="320 KCAL" color="green" />
            <Badge icon={<TrendingUp size={12} />} text="STRENGTH" />
          </div>
        </div>
        <div className={`p-2 rounded-full border transition-all ${isOpen ? 'bg-[#00ff94] text-black' : 'text-gray-500'}`}>
          {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
      </button>

      {isOpen && (
        <div className="px-8 pb-10 space-y-8 animate-in fade-in slide-in-from-top-2 duration-500">
          {day.warmup && (
            <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex items-start gap-4">
              <Zap size={18} className="text-[#00ff94] mt-1 shrink-0" />
              <div>
                <p className="text-[10px] font-black text-[#00ff94] uppercase tracking-widest mb-1">Warm-up Protocol</p>
                <p className="text-sm text-gray-300 font-medium leading-relaxed">{day.warmup}</p>
              </div>
            </div>
          )}

          <div className="grid gap-3">
            {day.exercises.map((ex, i) => (
              <div key={i} className="flex items-center gap-5 p-5 rounded-[1.8rem] bg-[#05110B] border border-white/5 hover:border-[#00ff94]/30 transition-all group">
                <div className="w-14 h-14 bg-gray-900 rounded-2xl flex items-center justify-center text-[#00ff94] border border-white/5 group-hover:scale-110 transition-transform">
                  <Dumbbell size={24} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-white uppercase text-base group-hover:text-[#00ff94] transition-colors">{ex.name}</h4>
                  <p className="text-[11px] text-gray-500 italic mt-1 truncate">"{ex.notes || "Controlled reps"}"</p>
                </div>
                <div className="flex flex-col items-end">
                  <div className="text-base font-black text-white tabular-nums">{ex.sets} × {ex.reps}</div>
                  <span className="text-[9px] text-[#00ff94] font-black uppercase tracking-widest mt-1">{ex.restTime} REST</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const Badge = ({ icon, text, color = "gray" }: { icon: React.ReactNode; text: string; color?: string }) => (
  <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[9px] font-black tracking-widest border ${color === "green" ? "bg-[#00ff94]/10 text-[#00ff94] border-[#00ff94]/20" : "bg-white/5 text-gray-500 border-white/5"
    }`}>
    {icon} {text}
  </div>
);

export default AiWorkoutPage;