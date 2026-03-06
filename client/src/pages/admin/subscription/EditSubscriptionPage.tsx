import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FileText, Loader2, Save, Zap } from "lucide-react";
import { AdminLayout } from "../../../layout/admin/AdminLayout";
import { createSubscriptionSchema } from "../../../validators/admin/Subcription.Schema";
import type { CreateSubscriptionFormData } from "../../../validators/admin/Subcription.Schema";
import { useSubscriptionPlanById } from "../../../hooks/admin/subscription/use-admin-subscriptionById";
import { useUpdateSubscriptionPlan } from "../../../hooks/admin/subscription/use-admin-editSubscription";

export default function EditSubscription() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: subscription, isLoading } = useSubscriptionPlanById(id!);
  const { mutate, isPending } = useUpdateSubscriptionPlan();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateSubscriptionFormData>({
    resolver: zodResolver(createSubscriptionSchema) as any,
    defaultValues: {
      name: "",
      price: "",
      billingCycle: "1 month",
      description: "",
      sessionType: "none",
      sessionCredits: 0,
      aiWorkoutLimit: 0,
      aiDietLimit: 0,
    },
  });

  useEffect(() => {
    if (subscription) {
      reset({
        name: subscription.name || "",
        price: subscription.price?.toString() || "",
        billingCycle: subscription.billingCycle || "1 month",
        description: subscription.description || "",
        sessionType: subscription.sessionType || "none",
        sessionCredits: subscription.sessionCredits ?? 0,
        aiWorkoutLimit: subscription.aiWorkoutLimit ?? 0,
        aiDietLimit: subscription.aiDietLimit ?? 0,
      });
    }
  }, [subscription, reset]);

  const onSubmit = (data: CreateSubscriptionFormData) => {
    mutate({ id: id!, data }, {
      onSuccess: () => navigate("/admin/subscriptions"),
    });
  };

  // Ensure these are very distinct from the background
  const optionStyle = "bg-[#0a1810] text-white";

  if (isLoading) return (
    <div className="h-screen w-full bg-[#050a05] flex items-center justify-center">
      <Loader2 className="w-10 h-10 text-[#00ff94] animate-spin" />
    </div>
  );

  return (
    <AdminLayout>
      <div className="p-10 max-w-4xl mx-auto">
        <header className="mb-10">
          <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white">
            Edit Subscription Plan
          </h2>
          <p className="text-gray-500 text-xs italic mt-2">
            Modify the details, quotas, and pricing for this tier.
          </p>
        </header>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-[#0d1f17] border border-white/5 rounded-[2.5rem] p-10 space-y-10 shadow-2xl"
        >
          {/* SECTION 1: GENERAL INFORMATION */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#00ff94]/10 flex items-center justify-center">
                <FileText className="text-[#00ff94]" size={20} />
              </div>
              <h3 className="text-white font-bold text-lg italic uppercase">General Information</h3>
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Plan Name</label>
                <input {...register("name")} type="text" className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-6 text-white outline-none focus:border-[#00ff94]/50 transition-all" />
                {errors.name && <p className="text-red-500 text-[10px] italic">{errors.name.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Price ($)</label>
                <input {...register("price")} type="text" className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-6 text-white outline-none focus:border-[#00ff94]/50" />
                {errors.price && <p className="text-red-500 text-[10px] italic">{errors.price.message}</p>}
              </div>

              <div className="col-span-2 space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Billing Cycle</label>
                <select {...register("billingCycle")} className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-6 text-white outline-none focus:border-[#00ff94]/50 cursor-pointer appearance-none">
                  <option className={optionStyle} value="7 days">7 days</option>
                  <option className={optionStyle} value="1 month">1 month</option>
                  <option className={optionStyle} value="6 months">6 months</option>
                  <option className={optionStyle} value="Yearly">Yearly</option>
                </select>
              </div>

              <div className="col-span-2 space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Description</label>
                <textarea {...register("description")} rows={3} className="w-full bg-black/40 border border-white/10 rounded-[2rem] py-6 px-8 text-white outline-none focus:border-[#00ff94]/50 transition-all resize-none" />
                {errors.description && <p className="text-red-500 text-[10px] italic">{errors.description.message}</p>}
              </div>
            </div>
          </div>

          <div className="h-px bg-white/5 w-full" />

          {/* SECTION 2: PLAN QUOTAS */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#00ff94]/10 flex items-center justify-center">
                <Zap className="text-[#00ff94]" size={20} />
              </div>
              <h3 className="text-white font-bold text-lg italic uppercase">Plan Quotas & AI Access</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Session Access</label>
                <select {...register("sessionType")} className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-6 text-white outline-none focus:border-[#00ff94]/50 cursor-pointer appearance-none">
                  <option className={optionStyle} value="none">None</option>
                  <option className={optionStyle} value="one_on_one">1-on-1 Only</option>
                  <option className={optionStyle} value="group">Group Only</option>
                  <option className={optionStyle} value="both">Both Types</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Total Session Credits</label>
                <input {...register("sessionCredits", { valueAsNumber: true })} type="number" className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-6 text-white outline-none focus:border-[#00ff94]/50" />
                {errors.sessionCredits && <p className="text-red-500 text-[10px] italic">{errors.sessionCredits.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">AI Workout Prompts / Day</label>
                <input {...register("aiWorkoutLimit", { valueAsNumber: true })} type="number" placeholder="-1 for unlimited" className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-6 text-white outline-none focus:border-[#00ff94]/50" />
                {errors.aiWorkoutLimit && <p className="text-red-500 text-[10px] italic">{errors.aiWorkoutLimit.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">AI Diet Prompts / Day</label>
                <input {...register("aiDietLimit", { valueAsNumber: true })} type="number" className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-6 text-white outline-none focus:border-[#00ff94]/50" />
                {errors.aiDietLimit && <p className="text-red-500 text-[10px] italic">{errors.aiDietLimit.message}</p>}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-6 pt-6 border-t border-white/5">
            <button type="button" onClick={() => navigate("/admin/subscriptions")} className="text-gray-400 font-bold text-xs hover:text-white transition-all uppercase tracking-widest italic">Cancel</button>
            <button type="submit" disabled={isPending} className="bg-[#00ff94] text-black px-10 py-4 rounded-xl font-black uppercase italic text-sm flex items-center gap-2 hover:shadow-[0_0_20px_rgba(0,255,148,0.4)] disabled:opacity-50 transition-all">
              {isPending ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              Update Plan
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}