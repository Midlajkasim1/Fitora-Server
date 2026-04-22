import { Weight, Ruler, User, Flame, Video, MessageCircle } from "lucide-react";
import { usePremiumDashboard } from "../../../hooks/user/use-premiumDashboard";
import { BMIWidget } from "../../../components/user/BmiWidget";
import { ProgressChart } from "../../../components/user/ProgressChart";
import { useNavigate } from "react-router-dom";
import { UpdateWeightModal } from "../../../components/user/UpdateWeightModal";
import { useChatStore } from "../../../store/use-chat-store";

export default function PremiumDashboardPage() {
  const { data, isLoading } = usePremiumDashboard();
  const navigate = useNavigate();
  const { openChat } = useChatStore();
  if (isLoading || !data) return null;
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  }
    return (
      <div className="space-y-10">
     
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-5xl font-black italic uppercase tracking-tighter text-white">
              {getGreeting()}, <br /> {data.welcomeName}
            </h1>
            <div className="mt-4 inline-flex items-center gap-2 bg-[#00ff94]/10 text-[#00ff94] px-4 py-2 rounded-xl text-[10px] font-black uppercase italic">
              Welcome Back 👋
            </div>
          </div>
          <button 
          onClick={() => navigate("/upcoming-sessions")}
          className="bg-[#00ff94] text-black px-8 py-4 rounded-2xl font-black uppercase italic text-xs shadow-[0_0_30px_rgba(0,255,148,0.3)] hover:scale-105 transition-transform active:scale-95"
        >
          Upcoming Sessions
        </button>
        </div>

        {/* Grid: 4 Small Metrics & 1 Weight Loss Goal */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetricCard icon={Weight} label="Weight" value={data.metrics.weight} unit="kg" />
            <MetricCard icon={Ruler} label="Height" value={data.metrics.height} unit="cm" />
            <MetricCard icon={User} label="Age" value={data.metrics.age} unit="yrs" />
            <MetricCard icon={Flame} label="Body Fat" value={data.metrics.bodyFat} unit="%" />
          </div>

          <div className="lg:col-span-5 bg-[#132a1e] border border-white/5 p-8 rounded-[2.5rem] relative overflow-hidden">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2 text-orange-500">
                <Flame size={18} />
                <span className="font-bold uppercase italic text-sm">{data.metrics.primaryGoal}</span>
              </div>
              <span className="text-[#00ff94] font-black italic">{data.weightLoss.progressPercentage}%</span>
            </div>
            <h2 className="text-4xl font-black italic">{data.weightLoss.current} <span className="text-sm text-gray-500 lowercase font-bold">kg</span></h2>
            <div className="w-full h-3 bg-white/5 rounded-full mt-6 overflow-hidden">
              <div className="h-full bg-red-500 rounded-full" style={{ width: `${data.weightLoss.progressPercentage}%` }} />
            </div>
            <p className="text-[10px] text-gray-500 font-bold uppercase mt-4 text-right">Target: {data.weightLoss.target}kg</p>
          </div>
        </div>

        {/* Bottom Row: BMI, Progress, Next Session */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <BMIWidget value={data.bmi.value} status={data.bmi.status} />
          <ProgressChart data={data.monthlyProgress} />

      <div className={`${data.nextSession ? 'bg-gradient-to-br from-[#132a1e] to-[#0a1810] border border-[#00ff94]/20' : 'bg-[#132a1e]/50 border border-white/5'} p-8 rounded-[2.5rem] flex flex-col justify-between shadow-2xl transition-all`}>
          <div>
            <h3 className="font-black uppercase italic tracking-tight text-[#00ff94] text-xs">Next Session</h3>
            {data.nextSession ? (
              <div className="mt-8">
                <p className="text-[10px] font-black uppercase text-gray-500 italic">With {data.nextSession.trainerName}</p>
                
                <h2 className="text-3xl font-black uppercase italic leading-none mt-1 text-white">
                  {new Date(data.nextSession.startTime).toLocaleTimeString('en-US', { 
                    hour: 'numeric', 
                    minute: '2-digit', 
                    hour12: true 
                  })}
                </h2>

                <p className="mt-4 font-bold uppercase italic text-[10px] text-[#00ff94]/60">
                  {data.nextSession.type.toLowerCase().includes('group') 
                    ? "Group Session" 
                    : "Personal Session"}
                </p>
              </div>
            ) : (
              <div className="mt-8 flex flex-col items-center justify-center py-4 opacity-30">
                <Video size={32} className="text-gray-600 mb-2" />
                <p className="font-bold italic text-[10px] uppercase tracking-widest text-gray-400">No sessions booked</p>
              </div>
            )}
          </div>
          
          {data.nextSession && (
            <div className="flex gap-2 mt-6">
              <button 
                onClick={() => navigate(`/video-call/${data.nextSession?.slotId}`)}
                className="flex-1 bg-[#00ff94] text-black py-4 rounded-2xl font-black uppercase italic text-[10px] flex items-center justify-center gap-2 hover:bg-[#00e685] transition-transform active:scale-95 shadow-[0_0_20px_rgba(0,255,148,0.2)]"
              >
                <Video size={16} /> Start Class
              </button>
              <button 
                onClick={() => navigate(`/upcoming-sessions?chat=${data.nextSession?.trainerId}&back=dashboard`)}
                className="px-6 bg-white/5 text-gray-400 border border-white/10 py-4 rounded-2xl font-black uppercase italic text-[10px] flex items-center justify-center hover:bg-[#00ff94]/10 hover:text-[#00ff94] transition-all"
                title="Message Coach"
              >
                <MessageCircle size={18} />
              </button>
            </div>
          )}
        </div>
        </div>
         <UpdateWeightModal
        isOpen={data.showWeightModal} 
        currentWeight={data.metrics.weight} 
      />
      </div>
    );
  }

  const MetricCard = ({ icon: Icon, label, value, unit }: { icon: React.ElementType; label: string; value: string | number; unit: string }) => (
    <div className="bg-[#132a1e] border border-white/5 p-6 rounded-[2rem] flex flex-col items-center justify-center text-center gap-3 hover:border-[#00ff94]/20 transition-colors group">
      {/* Icon Container with subtle glow on hover */}
      <div className="text-[#00ff94] bg-[#00ff94]/5 p-3 rounded-2xl group-hover:bg-[#00ff94]/10 transition-colors">
        <Icon size={22} />
      </div>

      <div>
        <p className="text-[9px] uppercase font-black text-gray-500 tracking-[0.2em] italic mb-1">
          {label}
        </p>
        <h3 className="text-2xl font-black italic text-white">
          {value}
          <span className="text-[10px] font-bold text-gray-600 ml-1 lowercase">
            {unit}
          </span>
        </h3>
      </div>
    </div>

  );