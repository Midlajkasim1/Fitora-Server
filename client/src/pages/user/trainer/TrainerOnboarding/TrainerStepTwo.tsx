import { Activity, ArrowLeft, CheckCircle2, Dumbbell, Flame, Target, Trophy, Zap, AlertCircle } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { completeTrainerOnboarding } from "../../../../api/onboarding.apis";
import { OnboardingLayout } from "../../../../components/onboarding/OnboardingLayout";
import { useAuthStore } from "../../../../store/use-auth-store";
import { useOnboardingStore } from "../../../../store/use-onboarding-store";

const SPECIALIZATIONS = [
  { id: "hiit", label: "HIIT", desc: "High-intensity interval training", icon: Flame },
  { id: "yoga", label: "Yoga", desc: "Flexibility & mindfulness", icon: Target },
  { id: "zumba", label: "Zumba", desc: "Dance & cardio fitness", icon: Activity },
  { id: "martial_arts", label: "Martial Arts", desc: "Combat & discipline", icon: Trophy },
  { id: "strength", label: "Strength", desc: "Weightlifting & power", icon: Dumbbell },
  { id: "athletics", label: "Athletics", desc: "Performance & speed", icon: Zap },
];

export default function TrainerStepTwo() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null); 
  
  const { user } = useAuthStore();
  const { 
    trainerStepTwo, 
    setTrainerStepTwo, 
    getTrainerPayload, 
    clearTrainer 
  } = useOnboardingStore();

  const [selected, setSelected] = useState<string[]>(trainerStepTwo?.specializations || []);

  const toggleSkill = (id: string) => {
    setError(null); 
    setSelected(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const handleFinish = async () => {
    if (selected.length === 0) {
      setError("Please select at least one specialization.");
      return;
    }

    setLoading(true);
    setTrainerStepTwo({ specializations: selected });

    const payload = getTrainerPayload(user?.id || "");

    if (!payload) {
      toast.error("Session expired. Returning to Step 1.");
      navigate("/onboarding/trainer/step-1");
      setLoading(false);
      return;
    }

    try {
      await completeTrainerOnboarding(payload);
      
      useAuthStore.setState((state) => ({
        user: state.user ? { 
          ...state.user, 
          isOnboardingRequired: false, 
          approval_status: 'pending' 
        } : null
      }));

      clearTrainer();
      toast.success("Application submitted successfully!");
      navigate("/trainer/waiting-approval", { replace: true });

    } catch (error: any) {
      console.error("Onboarding Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <OnboardingLayout 
      title="Expertise & Skills" 
      subtitle="Select the disciplines you are certified to teach." 
      step={2}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {SPECIALIZATIONS.map((skill) => {
          const isActive = selected.includes(skill.id);
          return (
            <div 
              key={skill.id}
              onClick={() => toggleSkill(skill.id)}
              className={`p-6 rounded-2xl border transition-all cursor-pointer group relative ${
                isActive 
                ? 'border-[#00ff94] bg-[#00ff94]/5 shadow-[0_0_20px_rgba(0,255,148,0.05)]' 
                : error 
                  ? 'border-red-500/40 bg-red-500/5' 
                  : 'border-white/5 bg-[#0d1f17] hover:border-white/10'
              }`}
            >
              <skill.icon className={`w-6 h-6 mb-4 transition-colors ${isActive ? 'text-[#00ff94]' : error ? 'text-red-400' : 'text-gray-600 group-hover:text-gray-400'}`} />
              <h3 className="text-white font-black italic uppercase text-sm mb-1 tracking-tighter">{skill.label}</h3>
              <p className="text-gray-500 text-[10px] font-medium italic">{skill.desc}</p>
              
              {isActive && (
                <CheckCircle2 className="absolute top-4 right-4 w-5 h-5 text-[#00ff94] animate-in zoom-in duration-300" />
              )}
            </div>
          );
        })}
      </div>
      
      {error && (
        <div className="mt-6 flex items-center justify-center gap-2 text-red-500 animate-in fade-in slide-in-from-top-2">
          <AlertCircle className="w-4 h-4" />
          <p className="text-[10px] font-bold uppercase italic tracking-widest">{error}</p>
        </div>
      )}
      
      <div className={`${error ? 'pt-6' : 'pt-10'} space-y-4`}>
        <button 
          onClick={handleFinish}
          disabled={loading}
          className="w-full bg-[#00ff94] text-[#0d1f1d] font-black py-5 rounded-2xl italic uppercase tracking-tighter hover:shadow-[0_0_30px_rgba(0,255,148,0.3)] disabled:opacity-50 transition-all flex items-center justify-center gap-2"
        >
          {loading ? "Processing Application..." : "Complete Onboarding"}
          {!loading && <span className="text-xl">→</span>}
        </button>

        <button 
          onClick={() => navigate(-1)} 
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 text-gray-500 hover:text-white transition-colors text-[10px] font-bold uppercase tracking-widest italic"
        >
          <ArrowLeft className="w-3 h-3" /> Previous Step
        </button>
      </div>
    </OnboardingLayout>
  );
}