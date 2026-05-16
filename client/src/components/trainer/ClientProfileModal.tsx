import { useEffect, useState } from "react";
import { X, User, Mail, Phone, Calendar, Clock, CheckCircle2, MessageSquare } from "lucide-react";
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
  sessionHistory: Array<{
    slotId: string;
    startTime: string;
    endTime: string;
    type: string;
    status: string;
  }>;
}

interface ClientProfileModalProps {
  clientId: string;
  onClose: () => void;
  mode: 'profile' | 'sessions';
}

const ClientProfileModal = ({ clientId, onClose, mode }: ClientProfileModalProps) => {
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-[#0d1a16] border border-emerald-900/30 rounded-3xl w-full max-w-sm p-12 text-center">
         <div className="w-12 h-12 border-4 border-[#00ff94]/20 border-t-[#00ff94] rounded-full animate-spin mx-auto mb-4" />
         <p className="text-[#00ff94] text-[10px] font-black uppercase tracking-widest">Loading...</p>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className={`bg-[#0d1a16] border border-emerald-900/10 rounded-[2.5rem] w-full ${mode === 'profile' ? 'max-w-4xl' : 'max-w-xl'} overflow-hidden shadow-2xl relative my-auto`}>
        
        {/* Header */}
        <div className="p-8 border-b border-white/5 flex items-center justify-between bg-black/20">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 rounded-2xl bg-emerald-900/30 flex items-center justify-center border border-[#00ff94]/20">
                {mode === 'profile' ? <User className="text-[#00ff94]" size={20} /> : <Calendar className="text-[#00ff94]" size={20} />}
             </div>
             <div>
                <h2 className="text-xl font-black text-white italic uppercase tracking-tight">
                  {mode === 'profile' ? 'Client Profile' : 'Session History'}
                </h2>
                <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">
                  {details?.basicInfo.firstName} {details?.basicInfo.lastName}
                </p>
             </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl bg-white/5 text-gray-500 hover:text-white transition-all">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-10">
          {mode === 'profile' ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Info */}
              <div className="space-y-6">
                 <header className="flex items-center gap-3">
                   <span className="text-gray-600 text-[9px] font-black uppercase tracking-[0.4em] italic">Contact Info</span>
                   <div className="h-px flex-1 bg-white/5" />
                 </header>
                 <div className="space-y-3">
                   <InfoRow icon={Mail} label="Email" value={details?.basicInfo.email} />
                   <InfoRow icon={Phone} label="Phone" value={details?.basicInfo.phone || 'N/A'} />
                   <InfoRow icon={User} label="Gender" value={details?.basicInfo.gender || 'Unknown'} />
                   <InfoRow icon={Calendar} label="Age" value={details?.basicInfo.age ? `${details.basicInfo.age} Years` : 'N/A'} />
                 </div>
              </div>

              {/* Health Metrics */}
              <div className="space-y-6">
                 <header className="flex items-center gap-3">
                   <span className="text-gray-600 text-[9px] font-black uppercase tracking-[0.4em] italic">Biometrics</span>
                   <div className="h-px flex-1 bg-white/5" />
                 </header>
                 {details?.healthMetrics ? (
                   <div className="grid grid-cols-2 gap-4">
                     <MiniMetric label="Weight" value={details.healthMetrics.weight} unit="KG" />
                     <MiniMetric label="Height" value={details.healthMetrics.height} unit="CM" />
                     <MiniMetric label="Target" value={details.healthMetrics.targetWeight} unit="KG" />
                     <MiniMetric label="Goal" value={details.healthMetrics.goal.replace('_', ' ')} />
                   </div>
                 ) : (
                   <p className="text-gray-600 text-[10px] italic">No health metrics found.</p>
                 )}
              </div>
            </div>
          ) : (
            /* Session Details (Recent 3) */
            <div className="space-y-6">
               <header className="flex items-center gap-3">
                 <span className="text-gray-600 text-[9px] font-black uppercase tracking-[0.4em] italic">Recent Activity</span>
                 <div className="h-px flex-1 bg-white/5" />
               </header>
               <div className="space-y-4">
                  {details?.sessionHistory.slice(0, 3).map((session) => (
                    <div key={session.slotId} className="bg-white/[0.03] p-5 rounded-3xl border border-white/5 flex items-center justify-between">
                       <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-2xl ${session.status === 'completed' ? 'bg-[#00ff94]/10 text-[#00ff94]' : 'bg-orange-500/10 text-orange-500'}`}>
                             {session.status === 'completed' ? <CheckCircle2 size={18} /> : <Clock size={18} />}
                          </div>
                          <div>
                             <p className="text-sm font-black text-white italic uppercase">{new Date(session.startTime).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                             <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">
                                {new Date(session.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {session.type.replace('_', ' ')}
                             </p>
                          </div>
                       </div>
                       <span className={`text-[9px] font-black uppercase italic px-3 py-1 rounded-full ${session.status === 'completed' ? 'bg-[#00ff94]/10 text-[#00ff94]' : 'bg-orange-500/10 text-orange-500'}`}>
                          {session.status}
                       </span>
                    </div>
                  ))}
                  {(!details?.sessionHistory || details.sessionHistory.length === 0) && (
                    <p className="text-center text-gray-600 py-10 italic text-xs">No recent sessions.</p>
                  )}
               </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-8 bg-black/40 border-t border-white/5 flex gap-4">
          <button 
            onClick={onClose}
            className="flex-1 px-8 py-4 bg-white/5 text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-white/10 hover:text-white transition-all"
          >
            Close
          </button>
          {mode === 'profile' && (
            <button 
              onClick={() => {
                openChat(clientId);
                onClose();
              }}
              className="flex-1 px-8 py-4 bg-[#00ff94] text-black text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl hover:shadow-[0_0_30px_rgba(0,255,148,0.3)] transition-all font-bold italic flex items-center justify-center gap-2"
            >
              <MessageSquare size={16} />
              Chat
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

interface InfoRowProps {
  icon: React.ElementType;
  label: string;
  value: string | undefined;
}

const InfoRow = ({ icon: Icon, label, value }: InfoRowProps) => (
  <div className="flex items-center gap-4 bg-white/[0.02] p-4 rounded-2xl border border-white/5">
    <Icon size={14} className="text-[#00ff94]" />
    <div className="flex-1">
      <p className="text-[7px] text-gray-600 font-black uppercase tracking-widest mb-0.5">{label}</p>
      <p className="text-xs font-bold text-gray-300">{value}</p>
    </div>
  </div>
);

interface MiniMetricProps {
  label: string;
  value: string | number;
  unit?: string;
}

const MiniMetric = ({ label, value, unit }: MiniMetricProps) => (
  <div className="bg-white/[0.02] p-4 rounded-2xl border border-white/5">
    <p className="text-[7px] text-gray-600 font-black uppercase tracking-widest mb-1.5">{label}</p>
    <p className="text-sm font-black text-white italic uppercase">
      {value} <span className="text-[9px] text-gray-600 normal-case">{unit}</span>
    </p>
  </div>
);

export default ClientProfileModal;
