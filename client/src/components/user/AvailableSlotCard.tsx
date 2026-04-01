import { Clock, Users, User } from "lucide-react"; // Added User icon for personal sessions
import type { AvailableSlotResponse } from "../../type/user.types";

interface SlotCardProps {
  slot: AvailableSlotResponse;
  onBook: (id: string) => void;
  isBooking: boolean;
}

export const AvailableSlotCard = ({ slot, onBook, isBooking }: SlotCardProps) => {
  const start = new Date(slot.startTime);
  
  const available = Number(slot.availableSeats);
  const totalCapacity = Number(slot.capacity);
  
  const isFull = available <= 0;
  const alreadyBooked = slot.isBookedByUser;
  const isGroup = slot.type?.toLowerCase().includes('group');

  const sessionLabel = isGroup ? "Group Session" : "Personal Session";

  return (
    <div className="bg-[#132a1e] border border-white/5 p-6 rounded-[2.5rem] flex items-center justify-between group hover:border-[#00ff94]/30 transition-all duration-300">
      <div className="flex items-center gap-6">
        {/* Time Pillar */}
        <div className="flex flex-col items-center justify-center bg-black/20 rounded-2xl px-5 py-3 border border-white/5 min-w-[110px]">
          <span className="text-[#00ff94] text-[10px] font-black uppercase italic">Starts</span>
          <span className="text-white text-xl font-black italic whitespace-nowrap">
            {start.toLocaleTimeString('en-US', { 
              hour: 'numeric', 
              minute: '2-digit', 
              hour12: true 
            })}
          </span>
        </div>

        {/* Info Area */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h4 className="text-white font-bold uppercase italic tracking-tighter text-lg">
              Coach {slot.trainerName}
            </h4>
            <span className={`text-[8px] font-black px-2 py-0.5 rounded italic uppercase ${
              isGroup ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'
            }`}>
              {sessionLabel}
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            {/* ✅ Conditional Rendering for Seats */}
            {isGroup ? (
              <div className={`flex items-center gap-1 text-[10px] font-bold uppercase italic ${isFull ? 'text-red-500' : 'text-gray-500'}`}>
                <Users size={12} className={isFull ? 'text-red-500' : 'text-[#00ff94]'} />
                <span>{isFull ? "No Seats Left" : `${available} / ${totalCapacity} Seats`}</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 text-gray-500 text-[10px] font-bold uppercase italic">
                <User size={12} className="text-[#00ff94]" />
                <span>1-on-1 Session</span>
              </div>
            )}

            <div className="flex items-center gap-1 text-gray-500 text-[10px] font-bold uppercase italic">
              <Clock size={12} className="text-[#00ff94]" />
              <span>60 Min</span>
            </div>
          </div>
        </div>
      </div>

      <button
        disabled={isFull || alreadyBooked || isBooking}
        onClick={() => onBook(slot.id)}
        className={`px-8 py-4 rounded-2xl font-black uppercase italic text-[11px] transition-all active:scale-95 ${
          (isFull || alreadyBooked) 
          ? "bg-white/10 text-gray-500 cursor-not-allowed opacity-50" 
          : "bg-[#00ff94] text-black shadow-[0_0_20px_rgba(0,255,148,0.2)] hover:bg-[#00e685]"
        }`}
      >
        {isBooking 
          ? "Confirming..." 
          : alreadyBooked 
            ? "Booked" 
            : isFull 
              ? "Full" 
              : isGroup ? "Join Group" : "Book Now"}
      </button>
    </div>
  );
};