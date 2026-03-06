import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Target, Loader2, ArrowRight } from "lucide-react";
import { healthMetricsSchema } from "../../../validators/user/health-metrics.validator";
import type{ HealthMetricsFormData } from "../../../validators/user/health-metrics.validator";
import api from "../../../api/axios";


export default function ClientHealthMetrics() {
  const navigate = useNavigate();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<HealthMetricsFormData>({
    resolver: zodResolver(healthMetricsSchema) as any,
    defaultValues: { height: 175, weight: 70, targetWeight: 60, primaryGoal: "Weight Loss" }
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: HealthMetricsFormData) => {
      const response = await api.post("/user/health-metrics", data);
      return response.data;
    },
    onSuccess: () => {
      navigate("/premium-dashboard");
    },
  });

  return (
    <div className="min-h-screen bg-[#0a1810] text-white flex flex-col">
      <div className="max-w-4xl mx-auto w-full pt-12 px-6">
        <div className="mb-8">
          <p className="text-[10px] font-black uppercase italic tracking-widest text-[#00ff94] mb-2">Step 3 of 3</p>
          <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
            <div className="w-full h-full bg-[#00ff94] shadow-[0_0_15px_rgba(0,255,148,0.5)]" />
          </div>
        </div>

        <h1 className="text-5xl font-black italic uppercase tracking-tighter mb-4 leading-none">
          Your Health & <br /> <span className="text-gray-800 bg-white px-2">Daily Habits</span>
        </h1>
        <p className="text-gray-500 font-bold italic uppercase text-[11px] tracking-widest">
          Share your lifestyle and health details for better recommendations.
        </p>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <form 
          onSubmit={handleSubmit((data) => mutate(data))} 
          className="max-w-2xl w-full bg-[#132a1e]/40 border border-white/5 rounded-[2.5rem] p-10 space-y-8 backdrop-blur-xl"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Height */}
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase italic text-gray-400 tracking-widest ml-1">Height</label>
              <div className="relative">
                <input 
                  {...register("height")}
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
                  {...register("weight")}
                  className={`w-full bg-[#0a1810] border ${errors.weight ? 'border-red-500' : 'border-white/5'} rounded-2xl py-5 px-6 text-xl font-black italic outline-none focus:border-[#00ff94]/50 transition-all`}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 bg-[#00ff94] text-black text-[9px] font-black px-2 py-1 rounded italic">KG</span>
              </div>
              {errors.weight && <p className="text-red-500 text-[9px] font-bold italic uppercase">{errors.weight.message}</p>}
            </div>
          </div>

          <div className="flex items-center gap-2 py-2">
            <Target size={16} className="text-[#00ff94]" />
            <span className="text-[10px] font-black uppercase italic tracking-widest text-white">Goal weight</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Primary Goal */}
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase italic text-gray-400 tracking-widest ml-1">Primary Goal</label>
              <select 
                {...register("primaryGoal")}
                className="w-full bg-[#0a1810] border border-white/5 rounded-2xl py-5 px-6 text-sm font-bold italic outline-none focus:border-[#00ff94]/50 text-white appearance-none"
              >
                <option value="Weight Loss">Weight Loss</option>
                <option value="Muscle Gain">Muscle Gain</option>
                <option value="Endurance">Endurance</option>
                <option value="General Fitness">General Fitness</option>
              </select>
            </div>

            {/* Target Weight */}
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase italic text-gray-400 tracking-widest ml-1">Goal weight</label>
              <div className="relative">
                <input 
                  {...register("targetWeight")}
                  className={`w-full bg-[#0a1810] border ${errors.targetWeight ? 'border-red-500' : 'border-white/5'} rounded-2xl py-5 px-6 text-xl font-black italic outline-none focus:border-[#00ff94]/50 transition-all`}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"><Target size={18} /></span>
              </div>
              {errors.targetWeight && <p className="text-red-500 text-[9px] font-bold italic uppercase">{errors.targetWeight.message}</p>}
            </div>
          </div>

          <button 
            type="submit"
            disabled={isPending}
            className="w-full py-6 bg-[#00ff94] text-black font-black uppercase italic text-sm tracking-[0.2em] rounded-2xl flex items-center justify-center gap-3 hover:shadow-[0_0_40px_rgba(0,255,148,0.3)] transition-all disabled:opacity-50"
          >
            {isPending ? <Loader2 className="animate-spin" /> : <>Go to Dashboard <ArrowRight size={20} /></>}
          </button>

          <p className="text-center text-[9px] text-gray-600 font-bold uppercase tracking-widest italic pt-4">
            By completing this step, you agree to our Terms of Service.
          </p>
        </form>
      </div>
    </div>
  );
}