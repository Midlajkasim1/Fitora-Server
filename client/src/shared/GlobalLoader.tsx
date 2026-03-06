import { Loader2, ActivityIcon } from "lucide-react";

export const GlobalLoader = () => {
  return (
    <div className="h-screen w-full bg-[#0a1810] flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-[#00ff94]/10 blur-[100px] rounded-full animate-pulse" />
      
      <div className="relative flex flex-col items-center z-10">
        <div className="relative mb-6">
          <ActivityIcon size={48} className="text-[#00ff94] animate-pulse" />
          <Loader2 size={64} className="text-[#00ff94]/20 animate-spin absolute -top-2 -left-2" />
        </div>
        
        <h2 className="text-[#00ff94] font-black italic tracking-[0.3em] text-[10px] uppercase animate-bounce">
          Loading...
        </h2>
      </div>
    </div>
  );
};