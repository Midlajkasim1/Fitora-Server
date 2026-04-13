import React, { useState } from 'react';
import { Flame, TrendingUp, Utensils, Droplets, PieChart, ArrowLeft, ChevronDown, ChevronUp, Calendar, Badge } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PromptInput } from '../../../../components/user/ai-workout&diet/PromptInput';
import { useGenerateDiet, useDietPlan } from '../../../../hooks/user/ai-workout&plan/use-ai-generate';
import type { DietDay, Meal } from '../../../../type/user.types';

const AiDietPage = () => {
  const navigate = useNavigate();

  // 1. Auto-fetch existing diet
  const { data: existingDiet, isLoading: isFetching } = useDietPlan();

  // 2. Mutation for re-generation
  const { mutate: generate, isPending: isGenerating } = useGenerateDiet();

  const handleGenerate = () => {
    generate({ metrics: { days: 7 } });
  };

  const isBusy = isFetching || isGenerating;
  const planData = existingDiet;

  return (
    <div className="min-h-screen bg-[#05110B] text-white p-6 md:p-12 font-sans pt-28">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <button onClick={() => navigate('/ai-selection')} className="group flex items-center gap-2 text-gray-500 hover:text-[#00ff94] transition-colors mb-4 uppercase text-[10px] font-black tracking-widest">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back to AI Selection
          </button>
          <h1 className="text-4xl md:text-5xl font-black mb-1 uppercase italic tracking-tighter text-white">Your Personal Meal Plan</h1>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00ff94] animate-pulse"></span>
            Smart Nutrition for Your Goals
          </p>
        </header>

        <PromptInput title="Diet" onGenerate={handleGenerate} isPending={isBusy} />

        {planData?.success && planData?.weeklyPlan?.length > 0 ? (
          <div className="space-y-16">
            {planData.weeklyPlan.map((day, dIdx) => (
              <DietDayAccordion key={dIdx} day={day} isDefaultOpen={dIdx === 0} />
            ))}
          </div>
        ) : (
          !isBusy && (
            <div className="py-24 flex flex-col items-center justify-center border-2 border-dashed border-[#1A2E24] rounded-[3rem] text-center px-8 bg-[#0A1A12]/20">
              <Utensils size={32} className="text-gray-700 mb-6" />
              <p className="text-gray-500 max-w-md text-sm font-medium uppercase tracking-widest">
                No plan found. Create your weekly meal guide to get started.           
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
    <div className={`rounded-[2.5rem] border border-[#1A2E24] transition-all duration-500 overflow-hidden ${isOpen ? 'bg-[#0A1A12] border-[#00ff94]/20' : 'bg-[#0A1A12]/40'}`}>
      <button onClick={() => setIsOpen(!isOpen)} className="w-full flex items-center justify-between p-8 text-left">
        <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-black/40 border border-white/5 flex items-center justify-center text-[#00ff94]">
              <Calendar size={20} />
            </div>
            <span className="text-2xl font-black text-white uppercase italic tracking-tight">{day.day}</span>
          </div>
          <div className="flex gap-3">
            <Badge icon={<Flame size={12} />} text={`${day.totalCalories} KCAL`} color="green" />
            <Badge icon={<PieChart size={12} />} text={`${day.totalProtein}G PRO`} />
          </div>
        </div>
        <div className={`p-2 rounded-full border transition-all ${isOpen ? 'bg-[#00ff94] text-black' : 'text-gray-500'}`}>
          {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
      </button>

      {isOpen && (
        <div className="px-8 pb-10 space-y-12 animate-in fade-in slide-in-from-top-2 duration-500">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-white/5">
            <StatCard label="Energy Goal" value={day.totalCalories} unit="KCAL" icon={<Flame size={14} />} />
            <StatCard label="Protein" value={day.totalProtein} unit="G" icon={<PieChart size={14} />} />
            <StatCard label="Carbs" value={day.totalCarbs} unit="G" icon={<TrendingUp size={14} />} />
            <StatCard label="Hydration" value={day.waterIntake} unit="ML" icon={<Droplets size={14} />} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
  <div className="bg-[#05110B] border border-[#1A2E24] rounded-[2rem] p-8 space-y-6 hover:border-[#00ff94]/30 transition-all group">
    <div className="flex justify-between items-start">
      <div className="p-3 bg-[#00ff94]/10 rounded-2xl text-[#00ff94]">
        <Utensils size={20} />
      </div>
      <span className="text-[9px] font-black text-gray-600 uppercase tracking-[0.2em] bg-white/5 px-3 py-1 rounded-full">{meal.time}</span>
    </div>
    <div>
      <h4 className="text-[10px] text-[#00ff94] font-black uppercase tracking-[0.3em] mb-2">{meal.name}</h4>
      <h3 className="text-xl font-black text-white italic truncate">{meal.foods[0]}</h3>
      <p className="text-[11px] text-gray-500 mt-4 italic line-clamp-2">"{meal.foods.slice(1).join(", ")}"</p>
    </div>
    <div className="pt-6 border-t border-white/5 flex justify-between items-end">
      <div className="flex flex-col">
        <span className="text-2xl font-black text-white">{meal.calories}</span>
        <span className="text-[8px] text-gray-600 font-black uppercase">Kcal Energy</span>
      </div>
      <div className="flex gap-2">
        <MacroProgress label="P" color="blue" value={meal.protein} />
        <MacroProgress label="C" color="yellow" value={meal.carbs} />
        <MacroProgress label="F" color="red" value={meal.fats} />
      </div>
    </div>
  </div>
);

const MacroProgress = ({ label, color, value }: any) => (
  <div className="flex flex-col items-center">
    <span className={`text-[8px] font-black text-${color}-500`}>{value}G</span>
    <div className={`w-1 h-6 bg-${color}-500/20 rounded-full mt-1 overflow-hidden`}>
      <div className={`w-full bg-${color}-500 h-1/2 rounded-full`}></div>
    </div>
  </div>
);

const StatCard = ({ label, value, unit, icon }: any) => (
  <div className="bg-black/20 border border-white/5 p-5 rounded-2xl flex items-center justify-between group hover:bg-[#0E2419] transition-all">
    <div>
      <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">{label}</p>
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-black text-white">{value}</span>
        <span className="text-[9px] font-bold text-gray-600">{unit}</span>
      </div>
    </div>
    <div className="p-2.5 bg-white/5 rounded-xl text-gray-400 group-hover:text-[#00ff94] transition-colors">{icon}</div>
  </div>
);

export default AiDietPage;