// components/user/AvailableSlotCard.tsx
import { Clock, Users } from "lucide-react";
import type { AvailableSlotResponse } from "../../type/user.types";

interface SlotCardProps {
  slot: AvailableSlotResponse;
  onBook: (id: string) => void;
  isBooking: boolean;
}

export const AvailableSlotCard = ({ slot, onBook, isBooking }: SlotCardProps) => {
  const start = new Date(slot.startTime);
  const isFull = Number(slot.availableSeats) <= 0;
  const isGroup = slot.type?.toLowerCase().includes('group')

  return (
    <div className="bg-[#132a1e] border border-white/5 p-6 rounded-[2.5rem] flex items-center justify-between group hover:border-[#00ff94]/30 transition-all duration-300">
      <div className="flex items-center gap-6">
        {/* Time Pillar */}
        <div className="flex flex-col items-center justify-center bg-black/20 rounded-2xl px-5 py-3 border border-white/5">
          <span className="text-[#00ff94] text-[10px] font-black uppercase italic">Starts</span>
          <span className="text-white text-xl font-black italic">
            {start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>

        {/* Info Area */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h4 className="text-white font-bold uppercase italic tracking-tighter text-lg">
              Coach {slot.trainerName}
            </h4>
            <span className={`text-[8px] font-black px-2 py-0.5 rounded italic uppercase ${
              slot.type === 'group' ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'
            }`}>
              {slot.type.replace('_', ' ')}
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-gray-500 text-[10px] font-bold uppercase italic">
              <Users size={12} className="text-[#00ff94]" />
              <span>{slot.availableSeats} / {slot.capacity} Seats Available</span>
            </div>
            <div className="flex items-center gap-1 text-gray-500 text-[10px] font-bold uppercase italic">
              <Clock size={12} className="text-[#00ff94]" />
              <span>60 Min</span>
            </div>
          </div>
        </div>
      </div>

     <button
        // ✅ Combined disabling logic
        disabled={isFull || isBooking || isGroup}
        onClick={() => onBook(slot.id)}
        className={`px-8 py-4 rounded-2xl font-black uppercase italic text-[11px] transition-all active:scale-95 ${
          isFull 
          ? "bg-white/10 text-gray-500 cursor-not-allowed opacity-50" // High visibility for disabled state
          : "bg-[#00ff94] text-black shadow-[0_0_20px_rgba(0,255,148,0.2)] hover:bg-[#00e685]"
        }`}
      >
        {isBooking ? "Confirming..." : isFull ? "Fully Booked" : "Book Session"}
      </button>
    </div>
  );
};