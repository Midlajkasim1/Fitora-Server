// components/trainer/ClientCard.tsx
import { User, MessageSquare, Calendar } from "lucide-react";
import type { TrainerClient } from "../../type/trainer.types";
import { useChatStore } from "../../store/use-chat-store";

const ClientCard = ({ client, onProfileClick }: { client: TrainerClient, onProfileClick: () => void }) => {
  const { openChat } = useChatStore();
  const date = new Date(client.startTime);
  
  // Format: "Oct 24, 2023"
  const formattedDate = date.toLocaleDateString('en-US', { 
    month: 'short', day: 'numeric', year: 'numeric' 
  });
  
  // Format: "10:00 AM"
  const formattedTime = date.toLocaleTimeString('en-US', { 
    hour: '2-digit', minute: '2-digit' 
  });

  return (
    <div className="bg-[#1a2c26] p-6 rounded-2xl border border-emerald-900/10 relative group hover:border-[#00ff94]/30 transition-all">
      <div className="flex flex-col items-center text-center">
        {/* Avatar */}
        <div className="w-20 h-20 rounded-full overflow-hidden mb-4 border-2 border-[#00ff94]/20 shadow-lg bg-emerald-900/30 flex items-center justify-center">
          {client.profileImage ? (
            <img src={client.profileImage} alt={client.firstName} className="w-full h-full object-cover" />
          ) : (
            <span className="text-xl font-bold text-[#00ff94]">{client.firstName[0]}</span>
          )}
        </div>

        {/* Name */}
        <h3 className="text-white font-semibold text-lg italic">{client.firstName} {client.lastName}</h3>
        
        {/* Date & Time Display */}
        <div className="flex items-center gap-2 mt-1 text-[10px] text-gray-500 font-bold uppercase tracking-widest italic">
          <Calendar size={12} className="text-[#00ff94]" />
          <span>{formattedDate}</span>
          <span className="text-[#00ff94]">•</span>
          <span>{formattedTime}</span>
        </div>

        <p className="text-gray-500 text-[10px] mt-3 mb-6 uppercase tracking-[0.2em] font-black italic">
          Weight Loss Program
        </p>

        {/* Buttons */}
        <div className="w-full grid grid-cols-2 gap-3">
          <button 
            onClick={onProfileClick}
            className="flex items-center justify-center gap-2 py-2.5 bg-[#0d1a16] text-gray-400 rounded-xl hover:text-white hover:bg-white/5 transition text-[10px] font-bold uppercase italic border border-white/5"
          >
            <User size={14} /> Profile
          </button>
          <button 
            onClick={() => openChat(client.userId)}
            className="flex items-center justify-center gap-2 py-2.5 bg-[#0d1a16] text-gray-400 rounded-xl hover:text-white hover:bg-white/5 transition text-[10px] font-bold uppercase italic border border-white/5"
          >
            <MessageSquare size={14} /> Chat
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClientCard;