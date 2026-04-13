import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { FileText, Loader2, Save, Zap, ChevronDown, CheckCircle2 } from "lucide-react";
import { AdminLayout } from "../../layout/admin/AdminLayout";
import { createSubscriptionSchema, type CreateSubscriptionFormData } from "../../validators/admin/Subcription.Schema";
import { useEffect } from "react";

interface Props {
  mode: "create" | "edit";
  initialData?: any; 
  onSubmit: (data: CreateSubscriptionFormData) => void;
  isPending: boolean;
}

export default function SubscriptionForm({ mode, initialData, onSubmit, isPending }: Props) {
  const navigate = useNavigate();

  const {
  register,
  handleSubmit,
  formState: { errors },
  reset // Use reset to update values when initialData arrives
} = useForm<CreateSubscriptionFormData>({
  resolver: zodResolver(createSubscriptionSchema),
  defaultValues: {
    name: "",
    price: "",
    description: "",
    sessionCredits: 0,
    hasAiWorkout: false, 
    hasAiDiet: false,
    ...initialData
  },
});

// If initialData is loaded asynchronously (common in Edit mode), 
// use a useEffect to reset the form with the new data
useEffect(() => {
  if (initialData) {
    reset(initialData);
  }
}, [initialData, reset]);
  const optionStyle = "bg-[#0d1f17] text-white font-bold italic";

  return (
    <AdminLayout>
      <div className="p-10 max-w-4xl mx-auto">
        <header className="mb-10">
          <h2 className="text-4xl font-black italic uppercase tracking-tighter text-white">
            {mode === "create" ? "Create Plan" : "Edit Plan"}
          </h2>
          <p className="text-[#00ff94] text-[10px] font-black uppercase italic tracking-widest mt-2">
            Configure Premium Access Tiers
          </p>
        </header>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-[#0d1f17] border border-white/5 rounded-[2.5rem] p-10 space-y-10 shadow-2xl"
        >
          {/* SECTION 1: GENERAL INFO */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#00ff94]/10 rounded-lg">
                <FileText className="text-[#00ff94]" size={20} />
              </div>
              <h3 className="text-white font-black text-lg italic uppercase">General Information</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Plan Name</label>
                <input {...register("name")} className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-6 text-white outline-none focus:border-[#00ff94]/50 font-bold italic transition-all" />
                {errors.name && <p className="text-red-500 text-[10px] italic font-bold uppercase mt-1">{errors.name.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Price (₹)</label>
                <input {...register("price")} className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-6 text-white outline-none focus:border-[#00ff94]/50 font-bold italic" />
                {errors.price && <p className="text-red-500 text-[10px] italic font-bold uppercase mt-1">{errors.price.message}</p>}
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Billing Cycle</label>
                <div className="relative">
                  <select {...register("billingCycle")} className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-6 text-white font-bold italic outline-none appearance-none cursor-pointer">
                    <option className={optionStyle} value="1 month">1 Month (Standard)</option>
                    <option className={optionStyle} value="6 months">6 Months (Pro)</option>
                    <option className={optionStyle} value="1 yearly">1 Yearly (Elite)</option>
                  </select>
                  <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={18} />
                </div>
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Plan Description</label>
                <textarea {...register("description")} rows={3} className="w-full bg-black/40 border border-white/10 rounded-[2rem] py-6 px-8 text-white outline-none focus:border-[#00ff94]/50 resize-none font-bold italic" />
                {errors.description && <p className="text-red-500 text-[10px] italic font-bold uppercase mt-1">{errors.description.message}</p>}
              </div>
            </div>
          </div>

          <div className="h-px bg-white/5 w-full" />

          {/* SECTION 2: PERMISSIONS & FEATURES */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#00ff94]/10 rounded-lg">
                <Zap className="text-[#00ff94]" size={20} />
              </div>
              <h3 className="text-white font-black text-lg italic uppercase">Features & AI Access</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Session Access</label>
                <div className="relative">
                  <select {...register("sessionType")} className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-6 text-white font-bold italic outline-none appearance-none cursor-pointer">
                    <option className={optionStyle} value="one_on_one">1-on-1 Only</option>
                    <option className={optionStyle} value="group">Group Only</option>
                  </select>
                  <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={18} />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Credits</label>
                <input type="number" {...register("sessionCredits", { valueAsNumber: true })} className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-6 text-white outline-none focus:border-[#00ff94]/50 font-bold italic" />
              </div>

              {/* AI WORKOUT TOGGLE */}
              <label className="flex items-center justify-between p-6 bg-black/20 border border-white/5 rounded-3xl cursor-pointer hover:border-[#00ff94]/30 transition-all group">
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-black text-white uppercase italic">AI Workout Scheduling</span>
                  <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">Enable Weekly AI Workouts</span>
                </div>
                <input type="checkbox" {...register("hasAiWorkout")} className="w-6 h-6 accent-[#00ff94] bg-black border-white/10 rounded cursor-pointer" />
              </label>

              {/* AI DIET TOGGLE */}
              <label className="flex items-center justify-between p-6 bg-black/20 border border-white/5 rounded-3xl cursor-pointer hover:border-[#00ff94]/30 transition-all group">
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-black text-white uppercase italic">AI Diet Scheduling</span>
                  <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">Enable Weekly AI Diets</span>
                </div>
                <input type="checkbox" {...register("hasAiDiet")} className="w-6 h-6 accent-[#00ff94] bg-black border-white/10 rounded cursor-pointer" />
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-6 pt-6 border-t border-white/5">
            <button type="button" onClick={() => navigate("/admin/subscriptions")} className="text-gray-500 font-bold text-xs uppercase italic tracking-widest hover:text-white transition-all">Cancel</button>
            <button type="submit" disabled={isPending} className="bg-[#00ff94] text-black px-12 py-4 rounded-xl font-black uppercase italic text-sm flex items-center gap-2 disabled:opacity-50 hover:shadow-[0_0_20px_rgba(0,255,148,0.3)] transition-all">
              {isPending ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              {mode === "create" ? "Publish Plan" : "Update Plan"}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}