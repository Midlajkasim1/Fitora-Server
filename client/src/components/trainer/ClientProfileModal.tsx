import { useEffect, useState } from "react";
import { X, Activity, Scale, Ruler, User, Mail, Phone, Calendar, Target } from "lucide-react";
import { getClientDetails } from "../../api/trainer.api";
import { useChatStore } from "../../store/use-chat-store";

interface ClientDetails {
  basicInfo: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    profileImage: string | null;
    gender?: string;
    age?: number;
  };
  healthMetrics: {
    weight: number;
    height: number;
    targetWeight: number;
    goal: string;
  } | null;
}

interface ClientProfileModalProps {
  clientId: string;
  onClose: () => void;
}

const ClientProfileModal = ({ clientId, onClose }: ClientProfileModalProps) => {
  const { openChat } = useChatStore();
  const [details, setDetails] = useState<ClientDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const data = await getClientDetails(clientId);
        setDetails(data);
      } catch (error) {
        console.error("Failed to fetch client details", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [clientId]);

  if (loading) return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-[#0d1a16] border border-emerald-900/30 rounded-3xl w-full max-w-sm p-12 text-center">
         <div className="w-12 h-12 border-4 border-[#00ff94]/20 border-t-[#00ff94] rounded-full animate-spin mx-auto mb-4" />
         <p className="text-[#00ff94] text-[10px] font-black uppercase tracking-widest">Fetching Profile...</p>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#0d1a16] border border-emerald-900/10 rounded-[2.5rem] w-full max-w-2xl overflow-hidden shadow-2xl relative my-auto">
        {/* Header/Banner */}
        <div className="h-40 bg-gradient-to-br from-[#0a1f18] via-[#0d2a21] to-[#0d1a16] p-8 flex items-end relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#00ff94]/5 rounded-full blur-3xl -mr-32 -mt-32" />
          
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-full bg-black/20 text-gray-400 hover:text-white hover:bg-black/40 transition-all z-10"
          >
            <X size={20} />
          </button>
          
          <div className="flex items-center gap-6 relative z-10">
            <div className="w-24 h-24 rounded-full border-4 border-[#0d1a16] overflow-hidden bg-[#1a2c26] shadow-2xl flex items-center justify-center">
              {details?.basicInfo.profileImage ? (
                <img src={details.basicInfo.profileImage} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <User size={40} className="text-[#00ff94]/40" />
              )}
            </div>
            <div className="mb-2">
              <h2 className="text-3xl font-black text-white italic tracking-tight">
                {details?.basicInfo.firstName} {details?.basicInfo.lastName}
              </h2>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-[#00ff94] text-[9px] font-black uppercase tracking-[0.2em] bg-[#00ff94]/10 px-2.5 py-1 rounded-full border border-[#00ff94]/20">
                  Active Client
                </span>
                {details?.basicInfo.age && (
                   <span className="text-gray-500 text-[9px] font-black uppercase tracking-[0.2em]">{details.basicInfo.age} Years Old</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Section 1: Contact */}
          <div className="space-y-8">
            <header className="flex items-center gap-3">
               <div className="h-px flex-1 bg-white/5" />
               <span className="text-gray-600 text-[9px] font-black uppercase tracking-[0.4em] italic">Contact Info</span>
            </header>
            
            <div className="space-y-5">
              <div className="group">
                <p className="text-[8px] text-gray-600 uppercase font-black tracking-widest mb-1.5 ml-1">Email Address</p>
                <div className="flex items-center gap-4 bg-[#1a2c26]/30 p-4 rounded-2xl border border-white/5 group-hover:border-[#00ff94]/20 transition-all">
                  <Mail size={16} className="text-[#00ff94]" />
                  <span className="text-gray-300 text-xs font-bold">{details?.basicInfo.email}</span>
                </div>
              </div>

              <div className="group">
                <p className="text-[8px] text-gray-600 uppercase font-black tracking-widest mb-1.5 ml-1">Phone Number</p>
                <div className="flex items-center gap-4 bg-[#1a2c26]/30 p-4 rounded-2xl border border-white/5 group-hover:border-[#00ff94]/20 transition-all">
                  <Phone size={16} className="text-[#00ff94]" />
                  <span className="text-gray-300 text-xs font-bold">{details?.basicInfo.phone || 'Not provided'}</span>
                </div>
              </div>

              <div className="group">
                <p className="text-[8px] text-gray-600 uppercase font-black tracking-widest mb-1.5 ml-1">Gender</p>
                <div className="flex items-center gap-4 bg-[#1a2c26]/30 p-4 rounded-2xl border border-white/5 group-hover:border-[#00ff94]/20 transition-all">
                  <Calendar size={16} className="text-[#00ff94]" />
                  <span className="text-gray-300 text-xs font-bold capitalize">{details?.basicInfo.gender || 'Unknown'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Metrics */}
          <div className="space-y-8">
            <header className="flex items-center gap-3">
               <div className="h-px flex-1 bg-white/5" />
               <span className="text-gray-600 text-[9px] font-black uppercase tracking-[0.4em] italic">Biometrics</span>
            </header>

            {details?.healthMetrics ? (
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#1a2c26]/50 p-5 rounded-3xl border border-white/5 hover:border-orange-500/20 transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <Scale size={18} className="text-orange-500" />
                    <span className="text-[8px] text-gray-600 font-black uppercase">Current</span>
                  </div>
                  <p className="text-2xl font-black text-white italic">{details.healthMetrics.weight}<span className="text-[10px] text-gray-500 ml-1">KG</span></p>
                  <p className="text-[8px] text-gray-600 font-bold uppercase mt-1">Weight</p>
                </div>

                <div className="bg-[#1a2c26]/50 p-5 rounded-3xl border border-white/5 hover:border-sky-500/20 transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <Ruler size={18} className="text-sky-500" />
                    <span className="text-[8px] text-gray-600 font-black uppercase">Statue</span>
                  </div>
                  <p className="text-2xl font-black text-white italic">{details.healthMetrics.height}<span className="text-[10px] text-gray-500 ml-1">CM</span></p>
                  <p className="text-[8px] text-gray-600 font-bold uppercase mt-1">Height</p>
                </div>

                <div className="bg-[#1a2c26]/50 p-5 rounded-3xl border border-white/5 hover:border-emerald-500/20 transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <Target size={18} className="text-emerald-500" />
                    <span className="text-[8px] text-gray-600 font-black uppercase">Primary</span>
                  </div>
                  <p className="text-sm font-black text-white italic uppercase">{details.healthMetrics.goal.replace('_', ' ')}</p>
                  <p className="text-[8px] text-gray-600 font-bold uppercase mt-1">Goal</p>
                </div>

                <div className="bg-[#1a2c26]/50 p-5 rounded-3xl border border-white/5 hover:border-white/20 transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
                    <span className="text-[8px] text-gray-600 font-black uppercase">Target</span>
                  </div>
                  <p className="text-2xl font-black text-white italic">{details.healthMetrics.targetWeight}<span className="text-[10px] text-gray-500 ml-1">KG</span></p>
                  <p className="text-[8px] text-gray-600 font-bold uppercase mt-1">Weight</p>
                </div>
              </div>
            ) : (
              <div className="h-full min-h-[160px] flex flex-col items-center justify-center border border-dashed border-white/10 rounded-[2rem] bg-white/[0.02]">
                <Activity size={32} className="text-white/10 mb-3" />
                <p className="text-gray-600 text-[10px] font-black uppercase italic">Metrics Pending Completion</p>
              </div>
            )}
          </div>
        </div>

        {/* Action Bar */}
        <div className="px-10 py-8 bg-white/[0.02] border-t border-white/5 flex gap-4">
           <button 
             onClick={onClose}
             className="flex-1 px-8 py-4 bg-white/5 text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-white/10 hover:text-white transition-all shadow-xl"
           >
             Close View
           </button>
           <button 
             onClick={() => {
               openChat(clientId);
               onClose();
             }}
             className="flex-1 px-8 py-4 bg-[#00ff94] text-black text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl hover:shadow-[0_0_30px_rgba(0,255,148,0.3)] transition-all shadow-xl"
           >
             Message Client
           </button>
        </div>
      </div>
    </div>
  );
};

export default ClientProfileModal;
