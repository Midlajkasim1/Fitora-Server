import { zodResolver } from "@hookform/resolvers/zod";
import {
  CheckCircle2, ChevronDown, Dumbbell, Flame, Heart, Target, Trophy, User, Zap
} from "lucide-react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { OnboardingLayout } from "../../../../components/auth/onboarding/OnboardingLayout";
import { useOnboardingStore } from "../../../../store/use-onboarding-store";
import type { ClientStepOne } from "../../../../type/onboarding.types";
import { useSpecializations } from "../../../../hooks/user/use-specialization";

const schema = z.object({
  dob: z.string()
    .min(1, "Date of birth is required")
    .refine((date) => {
      const selectedDate = new Date(date);
      const now = new Date();
      return selectedDate <= now;
    }, "Date of birth cannot be in the future")
    .refine((date) => {
      const year = new Date(date).getFullYear();
      return year > 1920 && year <= 2012
    }, "Please enter a realistic year"),
  gender: z.enum(["male", "female", "other"]),
  preferredWorkouts: z.array(z.string()).min(1, "Select at least one workout"),
  experienceLevel: z.string().min(1, "Select experience level"),
  primaryMotives: z.array(z.string()).min(1, "Select at least one motive"),
});

export default function ClientStepOnePage() {
  const navigate = useNavigate();
  const setClientStepOne = useOnboardingStore((state) => state.setClientStepOne);
  const { data: specialization = [], isLoading } = useSpecializations();


  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<ClientStepOne>({
    resolver: zodResolver(schema),
    defaultValues: { preferredWorkouts: [], primaryMotives: [] },
  });

  const selectedGender = watch("gender");
  const selectedWorkouts = watch("preferredWorkouts") || [];
  const selectedMotives = watch("primaryMotives") || [];

  const onSubmit = (data: ClientStepOne) => {
    setClientStepOne(data);
    navigate("/onboarding/user/step-2");
  };

const toggleSelection = (field: keyof ClientStepOne, val: string) => {
  const current = (watch(field) as string[]) || [];

  const next = current.includes(val)
    ? current.filter(i => i !== val)
    : [...current, val];

  setValue(field, next as any, { shouldValidate: true });
};

  return (
    <OnboardingLayout title="Create Your Profile" subtitle="Complete these final details to help our AI understand your starting point." step={1}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">

        <div className="space-y-3">
          <label className="text-gray-400 text-[10px] font-bold uppercase tracking-widest ml-1 italic">Date of Birth</label>
          <input
            type="date"
            {...register("dob")}
            className="w-full bg-[#0a1810] border border-white/5 rounded-2xl p-4 text-white outline-none focus:border-[#00ff94]/50 transition-all italic font-bold placeholder:text-gray-700"
          />
          {errors.dob && <p className="text-red-500 text-[10px] italic font-bold">{errors.dob.message}</p>}
        </div>

        <div className="space-y-3">
          <label className="text-gray-400 text-[10px] font-bold uppercase tracking-widest ml-1 italic">Gender</label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: "male", label: "Male" },
              { id: "female", label: "Female" },
              { id: "other", label: "Other" }
            ].map((g) => (
              <button
                key={g.id}
                type="button"
                onClick={() => setValue("gender", g.id as any, { shouldValidate: true })}
                className={`relative py-6 rounded-2xl border transition-all flex flex-col items-center gap-2 group ${selectedGender === g.id ? "bg-[#00ff94] border-[#00ff94]" : "bg-[#0a1810] border-white/5 hover:border-white/10"
                  }`}
              >
                <User className={`w-5 h-5 ${selectedGender === g.id ? "text-[#0d1f1d]" : "text-gray-500"}`} />
                <span className={`text-[10px] font-black uppercase italic ${selectedGender === g.id ? "text-[#0d1f1d]" : "text-gray-400"}`}>{g.label}</span>
                {selectedGender === g.id && <CheckCircle2 className="absolute top-2 right-2 w-3 h-3 text-[#0d1f1d]" />}
              </button>
            ))}
          </div>
          {errors.gender && <p className="text-red-500 text-[10px] italic font-bold ml-1">{errors.gender.message}</p>}
        </div>
       <div className="space-y-3">
  <label className="text-gray-400 text-[10px] font-bold uppercase tracking-widest ml-1 italic">
    Preferred Workouts
  </label>

  {isLoading ? (
    <p className="text-gray-500 text-sm">Loading workouts...</p>
  ) : (
    <div className="grid grid-cols-2 gap-3">
      {specialization.map((spec: any) => {
        const isActive = selectedWorkouts.includes(spec.id);

        return (
          <button
            key={spec.id}
            type="button"
            onClick={() => toggleSelection("preferredWorkouts", spec.id)}
            className={`relative p-5 rounded-2xl border transition-all flex items-center gap-4 ${
              isActive
                ? "bg-[#00ff94] border-[#00ff94]"
                : "bg-[#0a1810] border-white/5 hover:border-white/10"
            }`}
          >
            <Dumbbell
              className={`w-5 h-5 ${
                isActive ? "text-[#0d1f1d]" : "text-[#00ff94]"
              }`}
            />

            <span
              className={`text-[11px] font-black uppercase italic ${
                isActive ? "text-[#0d1f1d]" : "text-white"
              }`}
            >
              {spec.name}
            </span>

            {isActive && (
              <CheckCircle2 className="absolute top-2 right-2 w-3 h-3 text-[#0d1f1d]" />
            )}
          </button>
        );
      })}
    </div>
  )}

  {errors.preferredWorkouts && (
    <p className="text-red-500 text-[10px] italic font-bold ml-1">
      {errors.preferredWorkouts.message}
    </p>
  )}
</div>

        <div className="space-y-3">
          <label className="text-gray-400 text-[10px] font-bold uppercase tracking-widest ml-1 italic">Primary Motives</label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { id: "weight_loss", label: "Lose Weight", icon: Flame },
              { id: "muscle_gain", label: "Build Muscle", icon: Dumbbell },
              { id: "endurance", label: "Endurance", icon: Target },
              { id: "athleticism", label: "Athleticism", icon: Trophy }
            ].map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => toggleSelection("primaryMotives", m.id)}
                className={`relative p-5 rounded-2xl border transition-all flex items-center gap-4 group ${selectedMotives.includes(m.id) ? "bg-[#00ff94] border-[#00ff94]" : "bg-[#0a1810] border-white/5 hover:border-white/10"
                  }`}
              >
                <m.icon className={`w-5 h-5 ${selectedMotives.includes(m.id) ? "text-[#0d1f1d]" : "text-[#00ff94]"}`} />
                <span className={`text-[11px] font-black uppercase italic ${selectedMotives.includes(m.id) ? "text-[#0d1f1d]" : "text-white"}`}>{m.label}</span>
                {selectedMotives.includes(m.id) && <CheckCircle2 className="absolute top-2 right-2 w-3 h-3 text-[#0d1f1d]" />}
              </button>
            ))}
          </div>
          {errors.primaryMotives && <p className="text-red-500 text-[10px] italic font-bold ml-1">{errors.primaryMotives.message}</p>}
        </div>

        <div className="space-y-3">
          <label className="text-gray-400 text-[10px] font-bold uppercase tracking-widest ml-1 italic">Experience Level</label>
          <div className="relative">
            <select
              {...register("experienceLevel")}
              className="w-full bg-[#0a1810] border border-white/5 rounded-2xl p-4 text-white outline-none focus:border-[#00ff94]/50 transition-all appearance-none italic font-bold"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-[#00ff94] text-[#0d1f1d] font-black py-5 rounded-2xl italic uppercase tracking-tighter hover:shadow-[0_0_30px_rgba(0,255,148,0.3)] transition-all flex items-center justify-center gap-2 mt-4"
        >
          Next Step
          <span className="text-xl">→</span>
        </button>

      </form>
    </OnboardingLayout>
  );
}