import { Calendar, Users } from "lucide-react";
import type { UpcomingSession } from "../../type/trainer.types";
import { Link, useNavigate } from "react-router-dom";

interface SessionCardProps {
  session: UpcomingSession;
}

const SessionCard = ({ session }: SessionCardProps) => {
  const navigate = useNavigate();
  const isPersonal = session.type === 'one_on_one';
  const isLive = session.status === 'live';
  const isCompleted = session.status === 'completed';

  return (
    <div className={`p-6 rounded-2xl border transition-all duration-300 shadow-lg ${
      isLive 
        ? "bg-emerald-950/40 border-emerald-500/50 scale-[1.02]" 
        : isCompleted
          ? "bg-gray-900/40 border-white/5 opacity-80"
          : "bg-[#0f241d] border-emerald-900/20 hover:border-emerald-500/30"
    }`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {/* Avatar Placeholder */}
          <div className={`w-10 h-10 rounded-full flex items-center justify-center border ${
            isLive ? 'bg-emerald-500/20 border-emerald-500/40' : 'bg-emerald-900/30 border-emerald-500/20'
          }`}>
            <Users size={18} className={isLive ? "text-[#00ffa3]" : "text-emerald-500"} />
          </div>
          
          <div>
            <h4 className="font-semibold text-white text-sm">
              {isPersonal ? 'Personal Session' : `Group Class (${session.bookedCount})`}
            </h4>
            <div className="flex gap-2 mt-1">
               <span className={`text-[10px] px-2 py-0.5 rounded uppercase font-bold tracking-wider ${
                isPersonal 
                ? 'bg-emerald-500/20 text-emerald-400' 
                : 'bg-purple-500/20 text-purple-400'
              }`}>
                {isPersonal ? 'Personal' : 'Group'}
              </span>
              {isLive && (
                <span className="text-[10px] px-2 py-0.5 rounded uppercase font-bold tracking-wider bg-red-500/20 text-red-500 animate-pulse">
                  Live Now
                </span>
              )}
               {isCompleted && (
                <span className="text-[10px] px-2 py-0.5 rounded uppercase font-bold tracking-wider bg-white/10 text-gray-400">
                  Completed
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        {/* Time Display */}
        <div className="flex items-center gap-2 text-xs text-white bg-black/40 p-2.5 rounded-xl border border-white/5">
          <Calendar size={14} className="text-emerald-500" /> 
          <span className="font-medium">
            {new Date(session.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
          </span>
          <span className="text-gray-500 ml-auto">
            {new Date(session.startTime).toLocaleDateString([], { weekday: 'short' })}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          {!isCompleted && (
            <>
              <button className="flex-1 text-xs text-gray-400 py-2.5 hover:bg-white/5 border border-white/5 rounded-xl transition font-medium disabled:opacity-50">
                Reschedule
              </button>
              <button 
                disabled={isCompleted}
                onClick={() => navigate(`/video-call/${session.slotId}`)}
                className={`flex-1 text-xs font-bold py-2.5 rounded-xl transition active:scale-95 shadow-lg ${
                  isLive 
                    ? "bg-red-500 text-white hover:bg-red-600 shadow-red-500/20" 
                    : "bg-[#00ffa3] text-black hover:bg-[#00e692] shadow-emerald-500/10"
                }`}
              >
                {isLive ? 'Join Now' : 'Start'}
              </button>
            </>
          )}
          {isCompleted && (
            <button disabled className="w-full text-xs text-gray-500 py-2.5 bg-white/5 border border-white/5 rounded-xl font-medium cursor-not-allowed">
              Session Concluded
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SessionCard;