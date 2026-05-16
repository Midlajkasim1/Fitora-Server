import React, { useState } from 'react';
import { Flame, TrendingUp, Utensils, Droplets, PieChart, ArrowLeft, ChevronDown, ChevronUp, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PromptInput } from '../../../../components/user/ai-workout&diet/PromptInput';
import { useGenerateDiet, useDietPlan } from '../../../../hooks/user/ai-workout&plan/use-ai-generate';
import type { DietDay, Meal } from '../../../../type/user.types';

import { useSubscriptionStatus } from '../../../../hooks/user/subscription/check-plan-status';
import { GlobalLoader } from '../../../../shared/GlobalLoader';

const AiDietPage = () => {
  const navigate = useNavigate();
  const { data: statusData, isLoading: isStatusLoading } = useSubscriptionStatus();
  const { data: existingDiet, isLoading: isFetching } = useDietPlan();
  const { mutate: generate, isPending: isGenerating } = useGenerateDiet();

  const hasAiDiet = statusData?.subscription?.hasAiDiet || false;

  if (isStatusLoading || isFetching) return <GlobalLoader />;

  if (!hasAiDiet) {
     navigate('/ai-selection');
     return null;
  }

  const handleGenerate = () => {
    generate({ metrics: { days: 7 } });
  };

  const isBusy = isFetching || isGenerating;
  const planData = (existingDiet as { data?: { success?: boolean; weeklyPlan?: DietDay[] } } | null)?.data || (existingDiet as { success?: boolean; weeklyPlan?: DietDay[] } | null);

  return (
    <div className="min-h-screen bg-[#05110B] text-white p-6 md:p-12 font-sans pt-28 selection:bg-[#00ff94] selection:text-black">
      <div className="max-w-6xl mx-auto relative">
        {/* Decorative Background Glows */}
        <div className="absolute top-[-100px] right-[-100px] w-96 h-96 bg-[#00ff94]/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[-100px] left-[-100px] w-80 h-80 bg-blue-500/5 blur-[100px] rounded-full pointer-events-none" />

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
                Smart <span className="text-gray-900 bg-white px-2">Nutritional</span> Plan
              </h1>
              <p className="text-gray-500 text-xs font-bold uppercase tracking-[0.3em] flex items-center gap-2 italic">
                <span className="w-2 h-2 rounded-full bg-[#00ff94] animate-pulse shadow-[0_0_10px_#00ff94]"></span>
                Precision meal scheduling for elite performance
              </p>
            </div>
            <div className="hidden md:block">
               <div className="flex items-center gap-4 bg-white/5 backdrop-blur-md border border-white/5 p-4 rounded-3xl">
                  <div className="w-10 h-10 bg-[#00ff94]/10 rounded-xl flex items-center justify-center text-[#00ff94]">
                     <PieChart size={20} />
                  </div>
                  <div>
                     <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest leading-none">Status</p>
                     <p className="text-[11px] font-black uppercase text-white tracking-widest mt-1">AI Optimized</p>
                  </div>
               </div>
            </div>
          </div>
        </header>

        <section className="mb-20">
          <PromptInput title="Diet" onGenerate={handleGenerate} isPending={isBusy} />
        </section>

        {planData?.success && planData?.weeklyPlan && planData.weeklyPlan.length > 0 ? (
          <div className="space-y-24 relative z-10">
            {planData.weeklyPlan.map((day: DietDay, dIdx: number) => (
              <DietDayAccordion key={dIdx} day={day} isDefaultOpen={dIdx === 0} />
            ))}
          </div>
        ) : (
          !isBusy && (
            <div className="py-32 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-[4rem] text-center px-8 bg-gradient-to-b from-white/[0.02] to-transparent">
              <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center text-gray-600 mb-8 border border-white/5 shadow-inner">
                <Utensils size={32} />
              </div>
              <h2 className="text-2xl font-black italic uppercase text-white/40 tracking-tighter mb-4 leading-none">No Plan Active</h2>
              <p className="text-gray-600 max-w-sm text-[11px] font-bold uppercase tracking-[0.2em] italic leading-relaxed">
                Unlock your performance potential by generating your first AI-driven nutritional guide.
              </p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

const DietDayAccordion = ({ day, isDefaultOpen }: { day: DietDay; isDefaultOpen: boolean }) => {
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
              <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest leading-none mb-1 block italic">Transformation Day</span>
              <span className="text-3xl font-black text-white uppercase italic tracking-tighter">{day.day}</span>
            </div>
          </div>
          
          <div className="flex gap-4">
            <Badge icon={<Flame size={12} />} text={`${day.totalCalories} KCAL`} active={isOpen} />
            <Badge icon={<PieChart size={12} />} text={`${day.totalProtein}G PROTEIN`} active={isOpen} />
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 px-4">
            <StatCard label="Energy Pool" value={day.totalCalories} unit="KCAL" icon={<Flame size={16} />} color="emerald" />
            <StatCard label="Muscle Repair" value={day.totalProtein} unit="G" icon={<PieChart size={16} />} color="blue" />
            <StatCard label="Performance" value={day.totalCarbs} unit="G" icon={<TrendingUp size={16} />} color="orange" />
            <StatCard label="Hydration" value={day.waterIntake} unit="ML" icon={<Droplets size={16} />} color="sky" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
            {day.meals.map((meal, mIdx) => (
              <MealCard key={mIdx} meal={meal} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const MealCard = ({ meal }: { meal: Meal }) => (
  <div className="bg-[#0A1A12] border border-white/5 rounded-[3rem] p-10 space-y-10 group hover:border-[#00ff94]/40 hover:translate-y-[-8px] transition-all duration-500 relative overflow-hidden shadow-2xl">
    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#00ff94]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    
    <div className="flex justify-between items-center relative z-10">
      <div className="w-12 h-12 bg-black/40 rounded-2xl flex items-center justify-center text-[#00ff94] border border-white/5 shadow-inner">
        <Utensils size={20} />
      </div>
      <span className="text-[10px] font-black text-gray-500 tracking-[0.2em] bg-white/5 px-4 py-1.5 rounded-full italic uppercase border border-white/5">{meal.time}</span>
    </div>

    <div className="space-y-2 relative z-10">
      <h4 className="text-[10px] text-[#00ff94] font-black uppercase tracking-[0.4em] mb-4 italic leading-none">{meal.name} Selection</h4>
      <h3 className="text-2xl font-black text-white italic tracking-tight leading-tight group-hover:text-[#00ff94] transition-colors">{meal.foods[0]}</h3>
      <p className="text-[12px] text-gray-500 font-medium italic border-l-2 border-[#00ff94]/20 pl-4 py-1">
        Supports: {meal.foods.slice(1).join(" • ")}
      </p>
    </div>

    <div className="pt-8 border-t border-white/[0.03] space-y-6 relative z-10">
      <div className="flex justify-between items-end">
        <div>
          <span className="text-3xl font-black text-white italic leading-tight">{meal.calories}</span>
          <span className="text-[9px] text-gray-600 font-bold uppercase tracking-widest block mt-1">Energy Burn (Kcal)</span>
        </div>
        <div className="flex items-center gap-3">
          <MacroBar label="P" value={meal.protein} color="bg-emerald-500" />
          <MacroBar label="C" value={meal.carbs} color="bg-orange-500" />
          <MacroBar label="F" value={meal.fats} color="bg-red-500" />
        </div>
      </div>
    </div>
  </div>
);

const MacroBar = ({ label, value, color }: { label: string; value: number; color: string }) => (
  <div className="flex flex-col items-center gap-1">
    <span className="text-[9px] font-black text-white/40">{label}</span>
    <div className="w-1.5 h-10 bg-white/5 rounded-full overflow-hidden relative">
      <div className={`absolute bottom-0 left-0 w-full ${color} rounded-full`} style={{ height: `${Math.min(value, 100)}%` }} />
    </div>
    <span className="text-[8px] font-black text-white/60">{value}g</span>
  </div>
);

const StatCard = ({ label, value, unit, icon, color }: { label: string; value: string | number; unit: string; icon: React.ReactNode; color: string }) => {
  const colorMap: Record<string, string> = {
    emerald: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/10',
    blue: 'text-blue-500 bg-blue-500/10 border-blue-500/10',
    orange: 'text-orange-500 bg-orange-500/10 border-orange-500/10',
    sky: 'text-sky-500 bg-sky-500/10 border-sky-500/10'
  };

  return (
    <div className="bg-[#0A1A12]/40 border border-white/5 p-6 rounded-[2rem] flex items-center justify-between group hover:bg-[#0E2419] transition-all hover:border-white/10 shadow-xl">
      <div>
        <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] italic mb-2 leading-none">{label}</p>
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-black text-white italic">{value}</span>
          <span className="text-[10px] font-bold text-gray-600 uppercase italic">{unit}</span>
        </div>
      </div>
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 ${colorMap[color] || 'text-[#00ff94] bg-[#00ff94]/10 border-[#00ff94]/10'}`}>
        {icon}
      </div>
    </div>
  );
};

const Badge = ({ icon, text, active }: { icon: React.ReactNode; text: string; active?: boolean }) => (
  <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-[10px] font-black tracking-widest border transition-all duration-500 ${
    active 
      ? "bg-white text-black border-white italic" 
      : "bg-white/5 text-gray-500 border-white/5 uppercase"
  }`}>
    {icon} {text}
  </div>
);

export default AiDietPage;