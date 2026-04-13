// components/user/ai-workout&diet/PromptInput.tsx
import { Sparkles, Zap, Loader2 } from 'lucide-react';

interface PromptInputProps {
  title: string;
  onGenerate: () => void;
  isPending: boolean;
}

export const PromptInput = ({ title, onGenerate, isPending }: PromptInputProps) => (
  <div className="bg-[#0A1A12] border border-[#1A2E24] rounded-[2.5rem] p-8 mb-12 relative overflow-hidden shadow-2xl">
    <div className="absolute -right-20 -top-20 w-64 h-64 bg-green-500/5 blur-[100px] rounded-full animate-pulse"></div>

    <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
      <div className="flex items-center gap-5">
        <div className="p-4 bg-green-500/10 rounded-2xl border border-green-500/20">
          <Sparkles className="text-green-500" size={28} />
        </div>
        <div>
          <h2 className="text-xl font-black text-white tracking-tight italic uppercase">AI {title} Planner</h2>
          <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] mt-1.5 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
            Customized for your body and goals
          </p>
        </div>
      </div>

      <button
        disabled={isPending}
        onClick={onGenerate}
        className="group relative flex items-center gap-3 px-12 py-4 bg-green-500 text-black text-[11px] font-black uppercase tracking-widest rounded-2xl hover:bg-green-400 transition-all shadow-[0_10px_30px_rgba(34,197,94,0.2)] disabled:opacity-30 disabled:grayscale"
      >
        {isPending ? <Loader2 className="animate-spin" size={16} /> : <Zap size={16} />}
        <span>{isPending ? 'Processing Neural Link...' : `Initialize Weekly ${title}`}</span>
      </button>
    </div>
  </div>
);