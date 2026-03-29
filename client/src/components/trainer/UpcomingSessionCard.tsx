import { Users, Video, ChevronRight } from "lucide-react";
import type { UpcomingSlot } from "../../type/trainer.types";

export const UpcomingSessionCard = ({ slot }: { slot: UpcomingSlot }) => {
  // We create Date objects from the UTC strings
  const start = new Date(slot.startTime);
//   const end = new Date(slot.endTime);
  
  const isGroup = slot.type === 'group';

  // Helper for consistent time formatting
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      
    });
  };

  return (
    <div className="bg-[#1a2c26] p-5 rounded-2xl border border-emerald-900/10 flex items-center justify-between group hover:border-[#00ff94]/30 transition-all">
      <div className="flex items-center gap-6">
        {/* Time Badge */}
        <div className="flex flex-col items-center justify-center bg-[#0d1a16] border border-white/5 rounded-xl px-4 py-2 min-w-[100px]">
          <span className="text-[#00ff94] text-[10px] font-black uppercase italic">
            {start.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
          </span>
          <span className="text-white text-sm font-bold">
            {formatTime(start)}
          </span>
        </div>

        {/* Info */}
        <div>
          <h4 className="text-white font-bold text-sm uppercase italic tracking-wider">
            {isGroup ? "Group Training Session" : "Personal Training"}
          </h4>
          <div className="flex items-center gap-4 mt-1">
            <span className={`text-[9px] font-black px-2 py-0.5 rounded uppercase italic ${
              isGroup ? 'bg-purple-500/20 text-purple-400' : 'bg-emerald-500/20 text-emerald-400'
            }`}>
              {slot.type === 'one_on_one' ? 'Personal' : 'Group'}
            </span>
            
            <div className="flex items-center gap-1 text-gray-500 text-[10px] font-bold uppercase italic">
              <Users size={12} className="text-[#00ff94]" />
              <span className="text-gray-300">{slot.bookedCount} / {slot.capacity}</span>
              <span className="ml-1">Booked</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Secondary Info: Duration */}
        <div className="hidden md:flex flex-col items-end mr-4">
           <span className="text-[9px] text-gray-500 uppercase font-bold italic">Duration</span>
           <span className="text-white text-xs font-bold">60 Min</span>
        </div>

        <button className="p-3 bg-[#0d1a16] text-gray-400 rounded-xl hover:text-[#00ff94] border border-white/5 transition">
          <Video size={18} />
        </button>
        
        <button className="flex items-center gap-2 px-6 py-3 bg-[#00ff94] text-black font-black text-[10px] rounded-xl hover:bg-[#00e685] transition uppercase italic shadow-[0_0_15px_rgba(0,255,148,0.2)] active:scale-95">
          Launch <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
};