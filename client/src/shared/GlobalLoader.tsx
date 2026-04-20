import { ActivityIcon } from "lucide-react";

export const GlobalLoader = () => {
  return (
    <div className="fixed inset-0 z-[9999] bg-[#06110d] flex flex-col items-center justify-center overflow-hidden">
      {/* Immersive Background Effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#00ff94]/5 blur-[120px] rounded-full animate-pulse" />
      <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-[#00ff94]/5 blur-[100px] rounded-full animate-pulse delay-75" />
      
      {/* Animated Core */}
      <div className="relative flex flex-col items-center">
        <div className="relative mb-10 scale-150">
          {/* Outer Ring */}
          <div className="absolute inset-0 border-4 border-[#00ff94]/10 rounded-full animate-[ping_2s_infinite]" />
          <div className="absolute -inset-4 border border-[#00ff94]/5 rounded-full animate-[spin_4s_linear_infinite]" />
          
          {/* Main Icon */}
          <div className="relative w-24 h-24 bg-[#0d1f17] rounded-full flex items-center justify-center border-2 border-[#00ff94]/20 shadow-[0_0_40px_rgba(0,255,148,0.15)]">
            <ActivityIcon size={40} className="text-[#00ff94] animate-pulse" />
          </div>
          
          {/* Scanning Line Effect */}
          <div className="absolute inset-0 overflow-hidden rounded-full">
            <div className="w-full h-1/2 bg-gradient-to-b from-transparent to-[#00ff94]/10 animate-[bounce_2s_infinite] opacity-50" />
          </div>
        </div>
        
        {/* Loading Text */}
        <div className="flex flex-col items-center gap-3">
          <h2 className="text-[#00ff94] font-black italic tracking-[0.5em] text-[12px] uppercase">
            Securing Session
          </h2>
          <div className="flex gap-1.5 h-1 items-center">
            <div className="w-8 h-full bg-[#00ff94] animate-[loading-bar_1.5s_infinite_ease-in-out_0s]" />
            <div className="w-8 h-full bg-[#00ff94] animate-[loading-bar_1.5s_infinite_ease-in-out_0.2s]" />
            <div className="w-8 h-full bg-[#00ff94] animate-[loading-bar_1.5s_infinite_ease-in-out_0.4s]" />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes loading-bar {
          0%, 100% { transform: scaleX(0.5); opacity: 0.2; }
          50% { transform: scaleX(1.5); opacity: 1; }
        }
      `}</style>
    </div>
  );
};