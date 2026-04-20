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

  // Check if session is live (Started by trainer)
  const isLive = session.status === 'active';

  return (
    <div className={`bg-[#132a1e] border-2 ${isLive ? 'border-[#00ff94] shadow-[0_0_20px_rgba(0,255,148,0.1)]' : 'border-white/5'} p-6 rounded-[2rem] flex items-center justify-between group hover:border-[#00ff94]/20 transition-all`}>
      <div className="flex items-center gap-6">
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
                    {startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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

      <div className="flex items-center gap-3">
        {/* Message Button */}
        <button 
          onClick={() => openChat(session.trainerId)}
          className="p-4 bg-white/5 text-gray-400 rounded-2xl border border-white/10 hover:bg-[#00ff94]/10 hover:text-[#00ff94] transition-all"
          title="Message Coach"
        >
          <MessageCircle size={20} />
        </button>
        
        {/* Cancel Button - Only if not live */}
        {!isLive && (
            <button 
                onClick={() => onCancel(session.slotId)}
                className="p-4 bg-red-500/10 text-red-500 rounded-2xl border border-red-500/10 hover:bg-red-500 hover:text-white transition-all shadow-lg"
            >
                <XCircle size={20} />
            </button>
        )}
        
        {/* Join Button - Final Corrected Link */}
        <button 
            onClick={() => navigate(`/video-call/${session.slotId}`)}
            className={`${isLive ? 'bg-[#00ff94] text-black scale-105' : 'bg-white/5 text-white border border-white/10'} px-8 py-4 rounded-2xl font-black uppercase italic text-[11px] shadow-[0_0_20px_rgba(0,255,148,0.2)] hover:scale-110 transition-all`}
        >
          {isLive ? 'Join Now' : 'Join Room'}
        </button>
      </div>
    </div>
  );
};