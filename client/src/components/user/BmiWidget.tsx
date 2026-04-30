

export const BMIWidget = ({ value, status }: { value: number; status: string }) => {
  const isHealthy = status.toLowerCase() === "normal";
  
  return (
    <div className="bg-[#132a1e] border border-white/5 p-6 rounded-[2.5rem] h-full">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#00ff94]/10 flex items-center justify-center text-[#00ff94]">
            <span className="font-bold text-xs">i</span>
          </div>
          <h3 className="font-bold uppercase italic tracking-tighter text-sm">BMI Insights</h3>
        </div>
        <span className={`px-3 py-0.5 rounded-full text-[9px] font-black uppercase italic ${isHealthy ? 'bg-[#00ff94]/20 text-[#00ff94]' : 'bg-orange-500/20 text-orange-400'}`}>
          {status}
        </span>
      </div>

      <div className="mt-8 text-center">
        <h1 className="text-5xl font-black italic">{value} <span className="text-xs text-gray-500">kg/m²</span></h1>
        
        {/* Simple Progress Bar Gauge */}
        <div className="relative h-2 w-full bg-white/10 rounded-full mt-8 overflow-hidden flex">
            <div className="h-full bg-blue-500 w-[20%]" />
            <div className="h-full bg-[#00ff94] w-[40%]" />
            <div className="h-full bg-orange-500 w-[20%]" />
            <div className="h-full bg-red-500 w-[20%]" />
        </div>
        <div className="flex justify-between text-[8px] uppercase font-bold text-gray-600 mt-2 italic">
            <span>Under</span><span>Normal</span><span>Over</span>
        </div>
      </div>
    </div>
  );
};