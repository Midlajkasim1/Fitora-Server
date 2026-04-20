export const AiStatItem = ({ label, value }: { label: string; value: string }) => (
  <div className="group">
    <div className="text-4xl md:text-5xl font-black text-white tracking-tighter italic group-hover:text-[#00ff94] transition-colors">{value}</div>
    <div className="text-[9px] text-gray-600 font-black uppercase tracking-[0.3em] mt-2 italic">{label}</div>
  </div>
);