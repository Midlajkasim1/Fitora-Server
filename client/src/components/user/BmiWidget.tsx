

export const BMIWidget = ({ value, status }: { value: number; status: string }) => {
  const isHealthy = status.toLowerCase() === "normal";
  
  return (
    <div className="bg-[#132a1e] border border-white/5 p-8 rounded-[2.5rem] h-full">
      <div className="flex justify-between items-center mb-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#00ff94]/10 flex items-center justify-center text-[#00ff94]">
            <span className="font-bold">i</span>
          </div>
          <h3 className="font-bold uppercase italic tracking-tighter">BMI Insights</h3>
        </div>
        <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase italic ${isHealthy ? 'bg-[#00ff94]/20 text-[#00ff94]' : 'bg-orange-500/20 text-orange-400'}`}>
          {status}
        </span>
      </div>

      <div className="mt-12 text-center">
        <h1 className="text-6xl font-black italic">{value} <span className="text-sm text-gray-500">kg/m²</span></h1>
        
        {/* Simple Progress Bar Gauge */}
        <div className="relative h-2 w-full bg-white/10 rounded-full mt-10 overflow-hidden flex">
            <div className="h-full bg-blue-500 w-[20%]" />
            <div className="h-full bg-[#00ff94] w-[40%]" />
            <div className="h-full bg-orange-500 w-[20%]" />
            <div className="h-full bg-red-500 w-[20%]" />
            {/* Pointer logic could go here based on value */}
        </div>
        <div className="flex justify-between text-[8px] uppercase font-bold text-gray-600 mt-2 italic">
            <span>Under</span><span>Normal</span><span>Over</span>
        </div>
      </div>
    </div>
  );
};