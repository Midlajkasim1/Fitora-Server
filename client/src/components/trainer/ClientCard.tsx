// components/trainer/ClientCard.tsx
import { User, Calendar, BookOpen } from "lucide-react";
import type { TrainerClient } from "../../type/trainer.types";

interface ClientCardProps {
  client: TrainerClient;
  onAction: (mode: 'profile' | 'sessions') => void;
}

const ClientCard = ({ client, onAction }: ClientCardProps) => {
  const date = new Date(client.lastSessionTime);
  
  const formattedDate = date.toLocaleDateString('en-US', { 
    month: 'short', day: 'numeric', year: 'numeric' 
  });

  return (
    <div className="bg-[#1a2c26] p-6 rounded-3xl border border-emerald-900/10 relative group hover:border-[#00ff94]/30 transition-all shadow-xl overflow-hidden">
      {/* Background Glow */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#00ff94]/5 rounded-full blur-3xl group-hover:bg-[#00ff94]/10 transition-all" />

      {/* Slot Count Badge */}
      <div className="absolute top-4 right-4 bg-[#00ff94]/10 text-[#00ff94] px-3 py-1 rounded-full text-[9px] font-black uppercase italic border border-[#00ff94]/20 flex items-center gap-1.5">
        <BookOpen size={10} />
        {client.totalBookedSlots} Slots
      </div>

      <div className="flex flex-col items-center text-center">
        {/* Avatar */}
        <div className="w-20 h-20 rounded-full overflow-hidden mb-4 border-2 border-[#00ff94]/20 shadow-lg bg-emerald-900/30 flex items-center justify-center group-hover:border-[#00ff94] transition-all transform group-hover:scale-105">
          {client.profileImage ? (
            <img src={client.profileImage} alt={client.firstName} className="w-full h-full object-cover" />
          ) : (
            <span className="text-xl font-black text-[#00ff94] italic">{client.firstName[0]}</span>
          )}
        </div>

        {/* Name */}
        <h3 className="text-white font-black text-lg italic uppercase tracking-tighter">{client.firstName} {client.lastName}</h3>
        <p className="text-gray-500 text-[8px] font-black uppercase tracking-[0.2em] mt-1">Last Active: {formattedDate}</p>

        {/* Action Buttons */}
        <div className="w-full grid grid-cols-2 gap-3 mt-8">
          <button 
            onClick={() => onAction('profile')}
            className="flex items-center justify-center gap-2 py-3.5 bg-[#0d1a16] text-gray-400 rounded-2xl hover:text-white hover:bg-white/5 transition-all text-[10px] font-black uppercase italic border border-white/5"
          >
            <User size={14} className="text-[#00ff94]" /> 
            Profile
          </button>
          <button 
            onClick={() => onAction('sessions')}
            className="flex items-center justify-center gap-2 py-3.5 bg-[#0d1a16] text-gray-400 rounded-2xl hover:text-white hover:bg-white/5 transition-all text-[10px] font-black uppercase italic border border-white/5"
          >
            <Calendar size={14} className="text-[#00ff94]" /> 
            Sessions
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClientCard;