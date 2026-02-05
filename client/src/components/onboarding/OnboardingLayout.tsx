type Props = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  step: number; // 1 or 2
};

export function OnboardingLayout({ title, subtitle, children, step }: Props) {
  return (
    <div className="min-h-screen w-full flex flex-col bg-[#0a1810] text-white selection:bg-[#00ff94] selection:text-[#0d1f17]">
      <main className="flex-1 flex items-center justify-center py-12 px-4 relative overflow-hidden">
        {/* Glowing Background Effect */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-[#00ff94]/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="w-full max-w-2xl relative z-10">
          {/* Progress Header */}
          <div className="flex flex-col mb-8 max-w-md mx-auto">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[#00ff94] text-[10px] font-bold uppercase tracking-widest">Step {step} of 2</span>
              <span className="text-gray-500 text-[10px] font-bold uppercase tracking-widest italic">Profile & Goals</span>
            </div>
            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#00ff94] transition-all duration-500 shadow-[0_0_10px_rgba(0,255,148,0.5)]" 
                style={{ width: `${(step / 2) * 100}%` }}
              />
            </div>
          </div>

          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-black italic tracking-tighter uppercase mb-2">{title}</h1>
            {subtitle && <p className="text-gray-400 text-xs font-medium italic">{subtitle}</p>}
          </div>

          <div className="bg-[#0d1f17]/80 backdrop-blur-2xl rounded-[2.5rem] p-8 md:p-12 border border-white/5 shadow-2xl">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
