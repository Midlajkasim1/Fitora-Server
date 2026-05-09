// components/trainer/UpcomingSessionCard.tsx
import { Edit2, Users, Video, Trash2 } from "lucide-react";
import type { UpcomingSlot } from "../../type/trainer.types";

interface UpcomingSessionCardProps {
  slot: UpcomingSlot;
  onEdit: (slot: UpcomingSlot) => void;
  onCancel: (slotId: string) => void;
  onStart: (slotId: string) => void;
}

export const UpcomingSessionCard = ({ slot, onEdit, onCancel, onStart }: UpcomingSessionCardProps) => {
  const start = new Date(slot.startTime);
  const isGroup = slot.type === "group";
  const isCompleted = slot.status === 'completed';
  const isLive = slot.status === 'live';

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="bg-[#1a2c26] p-4 md:p-5 rounded-2xl border border-emerald-900/10 flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-0 group hover:border-[#00ff94]/30 transition-all">
      <div className="flex items-center gap-4 md:gap-6">
        {/* Time Badge */}
        <div className="flex flex-col items-center justify-center bg-[#0d1a16] border border-white/5 rounded-xl px-3 md:px-4 py-2 min-w-[90px] md:min-w-[100px]">
          <span className="text-[#00ff94] text-[9px] md:text-[10px] font-black uppercase italic">
            {start.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
          </span>
          <span className="text-white text-xs md:text-sm font-bold">{formatTime(start)}</span>
        </div>

        {/* Info */}
        <div>
          <h4 className="text-white font-bold text-xs md:text-sm uppercase italic tracking-wider line-clamp-1">
            {isGroup ? "Group Session" : "Personal Session"}
          </h4>
          <div className="flex items-center gap-3 md:gap-4 mt-1">
            <span className={`text-[8px] md:text-[9px] font-black px-2 py-0.5 rounded uppercase italic ${isGroup ? "bg-purple-500/20 text-purple-400" : "bg-emerald-500/20 text-emerald-400"
              }`}>
              {slot.type === "one_on_one" ? "Personal" : "Group"}
            </span>

            <div className="flex items-center gap-1 text-gray-500 text-[9px] md:text-[10px] font-bold uppercase italic">
              <Users size={12} className="text-[#00ff94]" />
              <span className="text-gray-300">{slot.bookedCount}/{slot.capacity}</span>
              <span className="hidden xs:inline ml-1">Booked</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-3">
        {/* Secondary Info: Duration */}
        <div className="hidden md:flex flex-col items-end mr-4">
          <span className="text-[9px] text-gray-500 uppercase font-bold italic">Duration</span>
          <span className="text-white text-xs font-bold">60 Min</span>
        </div>

        <div className="flex items-center gap-2 flex-1 md:flex-none">
          {!isCompleted && (
            <>
              {/* EDIT BUTTON */}
              <button
                onClick={() => onEdit(slot)}
                className="p-3 bg-[#0d1a16] text-gray-400 rounded-xl hover:text-[#00ff94] border border-white/5 transition-all active:scale-90"
                title="Edit Slot"
              >
                <Edit2 size={16} className="md:w-[18px] md:h-[18px]" />
              </button>

              {/* CANCEL BUTTON */}
              <button
                onClick={() => onCancel(slot.slotId)}
                className="p-3 bg-[#0d1a16] text-red-400/50 rounded-xl hover:text-red-500 border border-white/5 transition-all active:scale-90"
                title="Cancel Session"
              >
                <Trash2 size={16} className="md:w-[18px] md:h-[18px]" />
              </button>
            </>
          )}

          {/* PRIMARY VIDEO ACTION */}
          <button
            onClick={() => !isCompleted && onStart(slot.slotId)}
            disabled={isCompleted}
            className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-4 md:px-6 py-3 font-black text-[9px] md:text-[10px] rounded-xl transition uppercase italic md:ml-2 ${isCompleted
                ? "bg-white/5 text-gray-500 border border-white/5 cursor-not-allowed opacity-50"
                : "bg-[#00ff94] text-black hover:bg-[#00e685] shadow-[0_0_15px_rgba(0,255,148,0.2)] active:scale-95"
              }`}
          >
            <Video size={14} className="md:w-4 md:h-4" />
            <span>{isCompleted ? 'Completed' : isLive ? 'Join' : 'Start'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};