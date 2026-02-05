import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  CheckCircle2,
  Droplets,
  Moon,
  Utensils,
  AlertCircle
} from "lucide-react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import toast from "react-hot-toast";

import { completeClientOnboarding } from "../../../../api/onboarding.apis";
import { OnboardingLayout } from "../../../../components/onboarding/OnboardingLayout";
import { useAuthStore } from "../../../../store/use-auth-store";
import { useOnboardingStore } from "../../../../store/use-onboarding-store";

const schema = z.object({
  dietPreference: z.string().min(1, "Please select a diet preference"),
  waterIntake: z.number({ invalid_type_error: "Enter a number" }).min(500, "Minimum 500ml required"),
  sleepHours: z.number({ invalid_type_error: "Enter a number" }).min(3, "Min 3 hours").max(12, "Max 12 hours"),
  medicalConditions: z.array(z.string()).min(1, "Select at least one option (or 'None')"),
});

type FormValues = z.infer<typeof schema>;

export default function ClientStepTwoPage() {
  const navigate = useNavigate();
  const { setClientStepTwo, getClientPayload, clearClient } = useOnboardingStore();
  const updateOnboardingStatus = useAuthStore((state) => state.updateOnboardingStatus);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      dietPreference: "",
      waterIntake: 2000,
      sleepHours: 7,
      medicalConditions: [],
    },
  });

  const selectedConditions = watch("medicalConditions") || [];
  const selectedDiet = watch("dietPreference");

  const toggleCondition = (val: string) => {
    const current = watch("medicalConditions") || [];
    let next: string[];

    if (val === "none") {
      next = current.includes("none") ? [] : ["none"];
    } else {
      const withoutNone = current.filter((i) => i !== "none");
      next = withoutNone.includes(val)
        ? withoutNone.filter((i) => i !== val)
        : [...withoutNone, val];
    }
    
    setValue("medicalConditions", next, { shouldValidate: true });
  };

  const onSubmit = async (data: FormValues) => {
    setClientStepTwo(data);
    const payload = getClientPayload();

    if (!payload) {
      toast.error("Step data missing. Redirecting...");
      navigate("/onboarding/user/step-1");
      return;
    }

    try {
      await completeClientOnboarding(payload);
      toast.success("Onboarding complete! Welcome to the club.");
      updateOnboardingStatus(false);
      clearClient();
      navigate("/home", { replace: true });
    } catch (error: any) {
      console.error("Submission failed", error);
    }
  };

  return (
    <OnboardingLayout 
      title="Final Details" 
      subtitle="Almost there! We need a few more lifestyle details to optimize your plan." 
      step={2}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
        
        <div className="space-y-3">
          <label className="text-gray-400 text-[10px] font-bold uppercase tracking-widest ml-1 italic">Diet Preference</label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { id: "omnivore", label: "Omnivore", icon: Utensils },
              { id: "vegetarian", label: "Vegetarian", icon: Utensils },
              { id: "vegan", label: "Vegan", icon: Utensils },
              { id: "keto", label: "Keto", icon: Utensils },
            ].map((diet) => (
              <button
                key={diet.id}
                type="button"
                onClick={() => setValue("dietPreference", diet.id, { shouldValidate: true })}
                className={`relative p-4 rounded-2xl border transition-all flex items-center gap-3 ${
                  selectedDiet === diet.id 
                    ? "bg-[#00ff94] border-[#00ff94]" 
                    : errors.dietPreference ? "border-red-500/50 bg-red-500/5" : "bg-[#0a1810] border-white/5 hover:border-white/10"
                }`}
              >
                <diet.icon className={`w-4 h-4 ${selectedDiet === diet.id ? "text-[#0d1f1d]" : "text-[#00ff94]"}`} />
                <span className={`text-[11px] font-black uppercase italic ${selectedDiet === diet.id ? "text-[#0d1f1d]" : "text-white"}`}>
                  {diet.label}
                </span>
                {selectedDiet === diet.id && <CheckCircle2 className="absolute top-2 right-2 w-3 h-3 text-[#0d1f1d]" />}
              </button>
            ))}
          </div>
          {errors.dietPreference && <p className="text-red-500 text-[10px] italic font-bold ml-1">{errors.dietPreference.message}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <label className="text-gray-400 text-[10px] font-bold uppercase tracking-widest ml-1 italic">Daily Water (ml)</label>
            <div className="relative flex items-center">
              <Droplets className="absolute left-4 w-4 h-4 text-[#00ff94]" />
              <input
                type="number"
                {...register("waterIntake", { valueAsNumber: true })}
                className={`w-full bg-[#0a1810] border ${errors.waterIntake ? 'border-red-500/50' : 'border-white/5'} rounded-2xl p-4 pl-12 text-white outline-none focus:border-[#00ff94]/50 italic font-bold`}
              />
            </div>
            {errors.waterIntake && <p className="text-red-500 text-[10px] italic font-bold ml-1">{errors.waterIntake.message}</p>}
          </div>

          <div className="space-y-3">
            <label className="text-gray-400 text-[10px] font-bold uppercase tracking-widest ml-1 italic">Sleep (Hours)</label>
            <div className="relative flex items-center">
              <Moon className="absolute left-4 w-4 h-4 text-[#00ff94]" />
              <input
                type="number"
                {...register("sleepHours", { valueAsNumber: true })}
                className={`w-full bg-[#0a1810] border ${errors.sleepHours ? 'border-red-500/50' : 'border-white/5'} rounded-2xl p-4 pl-12 text-white outline-none focus:border-[#00ff94]/50 italic font-bold`}
              />
            </div>
            {errors.sleepHours && <p className="text-red-500 text-[10px] italic font-bold ml-1">{errors.sleepHours.message}</p>}
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-gray-400 text-[10px] font-bold uppercase tracking-widest ml-1 italic">
            Medical Conditions
          </label>
          <div className="flex flex-wrap gap-3">
            {["diabetes", "bp", "none"].map((condition) => {
              const isSelected = selectedConditions.includes(condition);
              return (
                <button
                  key={condition}
                  type="button"
                  onClick={() => toggleCondition(condition)}
                  className={`px-6 py-3 rounded-xl border text-[10px] font-black uppercase italic transition-all ${
                    isSelected 
                      ? "bg-[#00ff94] border-[#00ff94] text-[#0d1f1d]" 
                      : errors.medicalConditions ? "border-red-500/40 bg-red-500/5 text-red-400" : "bg-[#0a1810] border-white/5 text-gray-400 hover:border-white/20"
                  }`}
                >
                  {condition === "none" ? "None / Healthy" : condition}
                </button>
              );
            })}
          </div>
          {errors.medicalConditions && <p className="text-red-500 text-[10px] italic font-bold ml-1">{errors.medicalConditions.message}</p>}
        </div>

        <div className="pt-4 space-y-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#00ff94] text-[#0d1f1d] font-black py-5 rounded-2xl italic uppercase tracking-tighter hover:shadow-[0_0_30px_rgba(0,255,148,0.3)] disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          >
            {isSubmitting ? "Finalizing..." : "Complete Profile"}
            {!isSubmitting && <span className="text-xl">→</span>}
          </button>

          <button
            type="button"
            onClick={() => navigate("/onboarding/user/step-1")}
            className="w-full flex items-center justify-center gap-2 text-gray-500 hover:text-white transition-colors text-[10px] font-bold uppercase tracking-widest italic"
          >
            <ArrowLeft className="w-3 h-3" /> Previous Step
          </button>
        </div>

      </form>
    </OnboardingLayout>
  );
}