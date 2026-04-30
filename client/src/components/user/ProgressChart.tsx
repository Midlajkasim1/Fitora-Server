export const ProgressChart = ({ data, title = "Activity Progress", subtitle = "This Week" }: { data: { day: string; value: number }[], title?: string, subtitle?: string }) => {
  return (
    <div className="bg-[#132a1e] border border-white/5 p-8 rounded-[2.5rem]">
      <div className="flex justify-between items-center mb-8">
        <h3 className="font-bold uppercase italic tracking-tighter">{title}</h3>
        <span className="text-[10px] uppercase font-bold text-gray-400">
            {subtitle}
        </span>
      </div>
      <div className="flex items-end justify-between h-48 gap-2">
        {data.map((item, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-4">
            <div 
              className={`w-full rounded-lg transition-all duration-1000 ${item.value > 70 ? 'bg-[#00ff94]' : 'bg-white/5'}`}
              style={{ height: `${item.value}%` }}
            />
            <span className="text-[10px] uppercase font-bold text-gray-600">{item.day}</span>
          </div>
        ))}
      </div>
    </div>
  );
};