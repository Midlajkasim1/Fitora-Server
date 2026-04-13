export const AiStatItem = ({ label, value }: { label: string; value: string }) => (
  <div>
    <div className="text-4xl font-black text-white tracking-tighter">{value}</div>
    <div className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] mt-2">{label}</div>
  </div>
);