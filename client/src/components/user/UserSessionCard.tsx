// components/user/UserSessionCard.tsx
import { User, XCircle } from "lucide-react";
import type { UserUpcomingSlot } from "../../type/user.types";

export const UserSessionCard = ({ 
  session, 
  onCancel 
}: { 
  session: UserUpcomingSlot; 
  onCancel: (id: string) => void 
}) => {
  const startDate = new Date(session.startTime);

  return (
    <div className="bg-[#132a1e] border border-white/5 p-6 rounded-[2rem] flex items-center justify-between group hover:border-[#00ff94]/20 transition-all">
      <div className="flex items-center gap-6">
        {/* Date Badge */}
        <div className="bg-black/20 p-4 rounded-2xl text-center min-w-[80px]">
          <p className="text-[#00ff94] text-[10px] font-black uppercase italic">
            {startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </p>
          <p className="text-white text-lg font-bold">
            {startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>

        <div>
          <h4 className="text-white font-bold uppercase italic tracking-tighter">
            {session.type === 'group' ? 'Group Class' : 'Private Session'}
          </h4>
          <div className="flex items-center gap-2 mt-1 text-gray-500">
            <User size={14} className="text-[#00ff94]" />
            <span className="text-[10px] font-bold uppercase italic">Coach {session.trainerName}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Only show cancel if session is in future (Backend handles 24h rule) */}
        <button 
          onClick={() => onCancel(session.slotId)}
          className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"
        >
          <XCircle size={18} />
        </button>
        <button className="bg-[#00ff94] text-black px-6 py-3 rounded-xl font-black uppercase italic text-[10px]">
          Join Room
        </button>
      </div>
    </div>
  );
};