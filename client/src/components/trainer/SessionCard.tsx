// components/trainer/SessionCard.tsx
import { Calendar, Users } from "lucide-react";
import type { UpcomingSession } from "../../type/trainer.types";

interface SessionCardProps {
  session: UpcomingSession;
}

const SessionCard = ({ session }: SessionCardProps) => {
  const isPersonal = session.type === 'one_on_one';

  return (
    <div className="bg-[#0f241d] p-6 rounded-2xl border border-emerald-900/20 shadow-lg hover:border-emerald-500/30 transition-all duration-300">
      <div className="flex items-center gap-3 mb-4">
        {/* Avatar Placeholder */}
        <div className="w-10 h-10 rounded-full bg-emerald-900/30 flex items-center justify-center border border-emerald-500/20">
          <Users size={18} className="text-emerald-500" />
        </div>
        
        <div>
          {/* Main Title - White text */}
          <h4 className="font-semibold text-white text-sm">
            {isPersonal ? 'Personal Session' : `Group Class (${session.bookedCount})`}
          </h4>
          
          {/* Dynamic Badge */}
          <span className={`text-[10px] px-2 py-0.5 rounded uppercase font-bold tracking-wider ${
            isPersonal 
            ? 'bg-emerald-500/20 text-emerald-400' 
            : 'bg-purple-500/20 text-purple-400'
          }`}>
            {isPersonal ? 'Personal' : 'Group'}
          </span>
        </div>
      </div>
      
      <div className="space-y-4">
        {/* Time Display */}
        <div className="flex items-center gap-2 text-xs text-white bg-black/40 p-2.5 rounded-xl border border-white/5">
          <Calendar size={14} className="text-emerald-500" /> 
          <span className="font-medium">
            {new Date(session.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
          <span className="text-gray-500 ml-auto">
            {new Date(session.startTime).toLocaleDateString([], { weekday: 'short' })}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button className="flex-1 text-xs text-gray-400 py-2.5 hover:bg-white/5 border border-white/5 rounded-xl transition font-medium">
            Reschedule
          </button>
          <button className="flex-1 text-xs bg-[#00ffa3] text-black font-bold py-2.5 rounded-xl hover:bg-[#00e692] shadow-lg shadow-emerald-500/10 transition active:scale-95">
            Start
          </button>
        </div>
      </div>
    </div>
  );
};

export default SessionCard;