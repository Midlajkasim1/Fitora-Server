import { User, XCircle, MessageCircle, PlayCircle } from "lucide-react";
import type { UserUpcomingSlot } from "../../type/user.types";
import { useChatStore } from "../../store/use-chat-store";
import { useNavigate } from "react-router-dom";

export const UserSessionCard = ({ 
  session, 
  onCancel 
}: { 
  session: UserUpcomingSlot; 
  onCancel: (id: string) => void 
}) => {
  const startDate = new Date(session.startTime);
  const { openChat } = useChatStore();
  const navigate = useNavigate();

  const isLive = session.status === 'live';
  const isCompleted = session.status === 'completed';


  return (
    <div className={`bg-[#132a1e] border-2 ${isLive ? 'border-[#00ff94] shadow-[0_0_20px_rgba(0,255,148,0.1)]' : 'border-white/5'} p-4 md:p-6 rounded-[2rem] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 group hover:border-[#00ff94]/20 transition-all`}>
      <div className="flex items-center gap-4 md:gap-6 w-full sm:w-auto">
        {/* Date Badge */}
        <div className={`p-4 rounded-2xl text-center min-w-[100px] ${isLive ? 'bg-[#00ff94] text-black' : 'bg-black/20 text-white'}`}>
          {isLive ? (
             <div className="flex flex-col items-center animate-pulse">
                <PlayCircle size={20} />
                <p className="text-[10px] font-black uppercase italic mt-1">Live Now</p>
             </div>
          ) : (
            <>
                <p className="text-[#00ff94] text-[10px] font-black uppercase italic">
                    {startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </p>
                <p className="text-white text-lg font-bold">
                    {startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
                </p>
            </>
          )}
        </div>

        <div>
          <h4 className="text-white font-bold uppercase italic tracking-tighter flex items-center gap-2">
            {session.type === 'group' ? 'Group Class' : 'Private Session'}
            {isLive && <span className="bg-[#00ff94]/20 text-[#00ff94] text-[8px] px-2 py-0.5 rounded-full border border-[#00ff94]/30 animate-pulse">Session Active</span>}
          </h4>
          <div className="flex items-center gap-2 mt-1 text-gray-500">
            <User size={14} className="text-[#00ff94]" />
            <span className="text-[10px] font-bold uppercase italic">Coach {session.trainerName}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-3 w-full sm:w-auto">
        {/* Message Button - Only if not completed */}
        {!isCompleted && (
          <button 
            onClick={() => openChat(session.trainerId)}
            className="flex-1 sm:flex-none p-3.5 md:p-4 bg-white/5 text-gray-400 rounded-2xl border border-white/10 hover:bg-[#00ff94]/10 hover:text-[#00ff94] transition-all flex items-center justify-center"
            title="Message Coach"
          >
            <MessageCircle size={18} />
          </button>
        )}
        
        {/* Cancel Button - Only if not live and not completed */}
        {!isLive && !isCompleted && (
            <button 
                onClick={() => onCancel(session.slotId)}
                className="flex-1 sm:flex-none p-3.5 md:p-4 bg-red-500/10 text-red-500 rounded-2xl border border-red-500/10 hover:bg-red-500 hover:text-white transition-all shadow-lg flex items-center justify-center"
                title="Cancel Booking"
            >
                <XCircle size={18} />
            </button>
        )}
        
        {/* Join Button / Status Button */}
        <button 
            disabled={isCompleted}
            onClick={() => !isCompleted && navigate(`/video-call/${session.slotId}`)}
            className={`flex-[2] sm:flex-none ${isLive ? 'bg-[#00ff94] text-black scale-105 shadow-[0_0_20px_rgba(0,255,148,0.3)]' : isCompleted ? 'bg-white/5 text-gray-500 border border-white/5 cursor-not-allowed' : 'bg-white/5 text-white border border-white/10'} px-4 md:px-8 py-3.5 md:py-4 rounded-2xl font-black uppercase italic text-[10px] md:text-[11px] hover:scale-105 transition-all truncate`}
        >
          {isLive ? 'Join Now' : isCompleted ? 'Completed' : 'Join Room'}
        </button>
      </div>
    </div>
  );
};