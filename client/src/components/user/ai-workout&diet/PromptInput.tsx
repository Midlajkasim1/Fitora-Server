// components/user/ai-workout&diet/PromptInput.tsx
import { Sparkles, Zap, Loader2 } from 'lucide-react';

interface PromptInputProps {
  title: string;
  onGenerate: () => void;
  isPending: boolean;
}

export const PromptInput = ({ title, onGenerate, isPending }: PromptInputProps) => (
  <div className="bg-[#0A1A12]/40 backdrop-blur-xl border border-white/5 rounded-[3.5rem] p-10 md:p-12 mb-16 relative overflow-hidden shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] group">
    <div className="absolute -right-20 -top-20 w-80 h-80 bg-[#00ff94]/5 blur-[120px] rounded-full group-hover:bg-[#00ff94]/10 transition-colors duration-1000"></div>

    <div className="flex flex-col md:flex-row items-center justify-between gap-10 relative z-10">
      <div className="flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
        <div className="w-16 h-16 bg-[#00ff94]/10 rounded-3xl border border-[#00ff94]/20 flex items-center justify-center text-[#00ff94] shadow-inner rotate-3 group-hover:rotate-0 transition-transform duration-500">
          <Sparkles size={32} strokeWidth={2.5} />
        </div>
        <div>
          <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter leading-none mb-3">AI {title} Matrix</h2>
          <p className="text-[10px] text-[#00ff94] font-black uppercase tracking-[0.4em] flex items-center justify-center md:justify-start gap-2 italic">
            <span className="w-2 h-2 rounded-full bg-[#00ff94] animate-pulse shadow-[0_0_10px_#00ff94]"></span>
            Neural optimization engaged
          </p>
        </div>
      </div>

      <button
        disabled={isPending}
        onClick={onGenerate}
        className="w-full md:w-auto relative flex items-center justify-center gap-4 px-16 py-6 bg-white text-black text-[12px] font-black uppercase tracking-[0.2em] italic rounded-3xl hover:bg-[#00ff94] transition-all shadow-[0_20px_40px_rgba(0,0,0,0.4)] hover:shadow-[0_20px_40px_rgba(0,255,148,0.2)] active:scale-95 disabled:opacity-20 disabled:grayscale transition-all duration-300 group/btn"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700 pointer-events-none" />
        {isPending ? <Loader2 className="animate-spin" size={18} strokeWidth={3} /> : <Zap size={18} strokeWidth={3} className="group-hover/btn:animate-bounce" />}
        <span>{isPending ? 'Syncing...' : `Build ${title} Plan`}</span>
      </button>
    </div>
  </div>
);