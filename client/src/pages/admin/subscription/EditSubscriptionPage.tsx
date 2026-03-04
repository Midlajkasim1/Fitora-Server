import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FileText, Loader2 } from "lucide-react";
import { AdminLayout } from "../../../layout/admin/AdminLayout";
import { createSubscriptionSchema } from "../../../validators/admin/Subcription.Schema";
import type { CreateSubscriptionFormData } from "../../../validators/admin/Subcription.Schema";
import { useSubscriptionById } from "../../../hooks/admin/subscription/use-admin-subscriptionById";
import { useUpdateSubscription } from "../../../hooks/admin/subscription/use-admin-editSubscription";

export default function EditSubscription() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const { data: subscription, isLoading } = useSubscriptionById(id!);
  const { mutate, isPending } = useUpdateSubscription();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateSubscriptionFormData>({
    resolver: zodResolver(createSubscriptionSchema),
  });

  useEffect(() => {
    if (subscription) {
      reset({
        name: subscription.name,
        price: subscription.price.toString(),
        billingCycle: subscription.billingCycle,
        description: subscription.description,
      });
    }
  }, [subscription, reset]);

  const onSubmit = (data: CreateSubscriptionFormData) => {
    mutate({ id: id!, data }, {
      onSuccess: () => navigate("/admin/subscriptions"),
    });
  };

  if (isLoading) return <div className="p-20 text-center text-[#00ff94] animate-pulse font-black italic">LOADING PLAN...</div>;

  return (
    <AdminLayout>
      <div className="p-10 max-w-4xl mx-auto">
        <header className="mb-10">
          <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white">
            Edit Subscription Plan
          </h2>
          <p className="text-gray-500 text-xs italic mt-2">
            Modify the details and pricing for this tier.
          </p>
        </header>

        <div className="bg-[#1a2e25] border border-white/5 rounded-[2.5rem] p-10 space-y-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-[#00ff94]/10 flex items-center justify-center">
              <FileText className="text-[#00ff94]" size={20} />
            </div>
            <h3 className="text-white font-bold text-lg">General Information</h3>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Plan Name</label>
              <input
                {...register("name")}
                className={`w-full bg-black/20 border ${errors.name ? 'border-red-500' : 'border-white/10'} rounded-2xl py-4 px-6 text-white outline-none focus:border-[#00ff94]/50 transition-all`}
              />
              {errors.name && <p className="text-red-500 text-[10px] italic ml-1">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Price ($)</label>
              <input
                {...register("price")}
                className={`w-full bg-black/20 border ${errors.price ? 'border-red-500' : 'border-white/10'} rounded-2xl py-4 px-6 text-white outline-none focus:border-[#00ff94]/50 transition-all`}
              />
              {errors.price && <p className="text-red-500 text-[10px] italic ml-1">{errors.price.message}</p>}
            </div>

            <div className="col-span-2 space-y-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Billing Cycle</label>
              <select
                {...register("billingCycle")}
                className="w-full bg-black/20 border border-white/10 rounded-2xl py-4 px-6 text-white outline-none focus:border-[#00ff94]/50 transition-all appearance-none cursor-pointer"
              >
                <option value="7 days">7 days</option>
                <option value="1 month">1 month</option>
                <option value="6 months">6 months</option>
                <option value="Yearly">Yearly</option>
              </select>
            </div>

            <div className="col-span-2 space-y-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Description</label>
              <textarea
                {...register("description")}
                rows={5}
                className={`w-full bg-black/20 border ${errors.description ? 'border-red-500' : 'border-white/10'} rounded-[2rem] py-6 px-8 text-white outline-none focus:border-[#00ff94]/50 transition-all resize-none`}
              />
              {errors.description && <p className="text-red-500 text-[10px] italic ml-1">{errors.description.message}</p>}
            </div>

            {/* ACTION BUTTONS BELOW FIELDS */}
            <div className="col-span-2 flex items-center justify-end gap-6 pt-4 border-t border-white/5">
              <button
                type="button"
                onClick={() => navigate("/admin/subscriptions")}
                className="text-gray-400 font-bold text-sm hover:text-white transition-all uppercase tracking-widest italic"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="bg-[#00ff94] text-black px-10 py-4 rounded-xl font-black uppercase italic text-sm flex items-center gap-2 hover:opacity-90 disabled:opacity-50 transition-all shadow-[0_0_20px_rgba(0,255,148,0.2)]"
              >
                {isPending && <Loader2 size={16} className="animate-spin" />}
                Update Plan
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}