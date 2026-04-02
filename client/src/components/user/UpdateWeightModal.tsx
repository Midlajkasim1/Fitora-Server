import { useState } from "react";
import { Scale, Loader2 } from "lucide-react";
import { useUpdateWeight } from "../../hooks/user/use-update-weight-progress";

interface UpdateWeightModalProps {
  isOpen: boolean;
  currentWeight: number;
}

export const UpdateWeightModal = ({ isOpen, currentWeight }: UpdateWeightModalProps) => {
  const [weight, setWeight] = useState(currentWeight);
  const { mutate, isPending } = useUpdateWeight();

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate(weight);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="bg-[#132a1e] border border-white/10 w-full max-w-md rounded-[3rem] p-10 relative animate-in fade-in zoom-in duration-300 shadow-2xl">
        
        <div className="flex flex-col items-center text-center space-y-6">
          {/* Icon Header */}
          <div className="bg-[#00ff94]/10 p-5 rounded-3xl text-[#00ff94] shadow-[0_0_20px_rgba(0,255,148,0.1)]">
            <Scale size={32} />
          </div>

          <div className="space-y-2">
            <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white">
              Update Weekly Weight
            </h2>
            <p className="text-gray-500 text-[10px] font-bold uppercase italic tracking-widest">
              Keep your stats accurate for better AI insights.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="w-full space-y-6">
            <div className="space-y-2 text-left">
              <label className="text-[10px] font-black text-gray-400 uppercase italic ml-2 tracking-widest">
                New Weight (kg)
              </label>
              <div className="relative">
                <input 
                  type="number" 
                  value={weight}
                  onChange={(e) => setWeight(Number(e.target.value))}
                  className="w-full bg-black/40 border border-white/5 rounded-2xl py-6 px-8 text-3xl font-black italic text-white focus:border-[#00ff94] outline-none transition-all"
                  required
                />
                <span className="absolute right-8 top-1/2 -translate-y-1/2 text-gray-500 font-black italic text-sm">
                  kg
                </span>
              </div>
            </div>

            <button 
              type="submit"
              disabled={isPending}
              className="w-full bg-[#00ff94] text-black py-6 rounded-2xl font-black uppercase italic text-sm shadow-[0_0_40px_rgba(0,255,148,0.2)] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isPending ? <Loader2 className="animate-spin" /> : "Submit Update"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};