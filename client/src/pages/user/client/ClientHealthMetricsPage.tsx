import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { Target, Loader2, ArrowRight } from "lucide-react";
import { healthMetricsSchema } from "../../../validators/user/health-metrics.validator";
import type { HealthMetricsFormData } from "../../../validators/user/health-metrics.validator";
import { useSaveHealthMetrics } from "../../../hooks/user/save-healthMetrics";

export default function ClientHealthMetrics() {
  const navigate = useNavigate();
  
  const { mutate, isPending } = useSaveHealthMetrics();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<HealthMetricsFormData>({
    resolver: zodResolver(healthMetricsSchema) as any,
    defaultValues: { 
      height: 175, 
      weight: 70, 
      targetWeight: 60, 
      primaryGoal: "Weight Loss" 
    }
  });

  const onSubmit = (data: HealthMetricsFormData) => {
    mutate(data, {
      onSuccess: () => {
        navigate("/premium-dashboard", { replace: true });
      }
    });
  };

  return (
    <div className="min-h-screen text-white flex flex-col">
      <div className="max-w-4xl mx-auto w-full pt-20 pb-12 px-6 text-center">
        <h1 className="text-5xl md:text-6xl font-black italic uppercase tracking-tighter mb-6 leading-none">
          Your Health & <br /> 
          <span className="text-gray-800 bg-[#00ff94] px-4 py-1 inline-block mt-2">Daily Habits</span>
        </h1>
        <p className="max-w-md mx-auto text-gray-500 font-bold italic uppercase text-[11px] tracking-[0.2em] leading-relaxed">
          Share your lifestyle and health details for better performance recommendations.
        </p>
      </div>

      <div className="flex-1 flex items-start justify-center p-6 pb-20">
        <form 
          onSubmit={handleSubmit(onSubmit)} 
          className="max-w-2xl w-full bg-[#132a1e]/40 border border-white/5 rounded-[2.5rem] p-10 space-y-8 backdrop-blur-xl shadow-2xl"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Height */}
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase italic text-gray-400 tracking-widest ml-1">Height</label>
              <div className="relative">
                <input 
                  type="number"
                  {...register("height", { valueAsNumber: true })}
                  className={`w-full bg-[#0a1810] border ${errors.height ? 'border-red-500' : 'border-white/5'} rounded-2xl py-5 px-6 text-xl font-black italic outline-none focus:border-[#00ff94]/50 transition-all`}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 bg-[#00ff94] text-black text-[9px] font-black px-2 py-1 rounded italic">CM</span>
              </div>
              {errors.height && <p className="text-red-500 text-[9px] font-bold italic uppercase">{errors.height.message}</p>}
            </div>

            {/* Weight */}
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase italic text-gray-400 tracking-widest ml-1">Weight</label>
              <div className="relative">
                <input 
                  type="number"
                  {...register("weight", { valueAsNumber: true })}
                  className={`w-full bg-[#0a1810] border ${errors.weight ? 'border-red-500' : 'border-white/5'} rounded-2xl py-5 px-6 text-xl font-black italic outline-none focus:border-[#00ff94]/50 transition-all`}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 bg-[#00ff94] text-black text-[9px] font-black px-2 py-1 rounded italic">KG</span>
              </div>
              {errors.weight && <p className="text-red-500 text-[9px] font-bold italic uppercase">{errors.weight.message}</p>}
            </div>
          </div>

          <div className="flex items-center gap-2 py-2 border-b border-white/5">
            <Target size={16} className="text-[#00ff94]" />
            <span className="text-[10px] font-black uppercase italic tracking-widest text-white">Performance Goal</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Primary Goal */}
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase italic text-gray-400 tracking-widest ml-1">Primary Goal</label>
              <div className="relative">
                <select 
                  {...register("primaryGoal")}
                  className="w-full bg-[#0a1810] border border-white/5 rounded-2xl py-5 px-6 text-sm font-bold italic outline-none focus:border-[#00ff94]/50 text-white appearance-none cursor-pointer"
                >
                  <option value="Weight Loss">Weight Loss</option>
                  <option value="Muscle Gain">Muscle Gain</option>
                  <option value="Endurance">Endurance</option>
                  <option value="General Fitness">General Fitness</option>
                </select>
                <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-[#00ff94]">
                   <ArrowRight size={14} className="rotate-90" />
                </div>
              </div>
            </div>

            {/* Target Weight */}
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase italic text-gray-400 tracking-widest ml-1">Target weight</label>
              <div className="relative">
                <input 
                  type="number"
                  {...register("targetWeight", { valueAsNumber: true })}
                  className={`w-full bg-[#0a1810] border ${errors.targetWeight ? 'border-red-500' : 'border-white/5'} rounded-2xl py-5 px-6 text-xl font-black italic outline-none focus:border-[#00ff94]/50 transition-all`}
                />
                <span className="absolute right-6 top-1/2 -translate-y-1/2 text-[#00ff94]/40"><Target size={18} /></span>
              </div>
              {errors.targetWeight && <p className="text-red-500 text-[9px] font-bold italic uppercase">{errors.targetWeight.message}</p>}
            </div>
          </div>

          <button 
            type="submit"
            disabled={isPending}
            className="w-full py-6 bg-[#00ff94] text-black font-black uppercase italic text-sm tracking-[0.2em] rounded-2xl flex items-center justify-center gap-3 hover:shadow-[0_0_40px_rgba(0,255,148,0.3)] hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 mt-4"
          >
            {isPending ? (
              <Loader2 className="animate-spin" />
            ) : (
              <>Complete Setup <ArrowRight size={20} /></>
            )}
          </button>

          <p className="text-center text-[9px] text-gray-600 font-bold uppercase tracking-[0.15em] italic pt-4">
            Secured end-to-end data encryption enabled.
          </p>
        </form>
      </div>
    </div>
  );
}