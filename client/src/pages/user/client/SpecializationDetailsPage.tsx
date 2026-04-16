import { useParams, useNavigate } from "react-router-dom";
import { useUserSpecializationById } from "../../../hooks/user/workout/use-user-specializationById";
import { Clock, Flame, ChevronRight, Zap } from "lucide-react";

export default function SpecializationDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, isError } = useUserSpecializationById(id!);

  if (isLoading) return <div className="py-40 text-center text-white bg-[#07140f] h-screen font-black uppercase italic">Syncing System...</div>;
  if (isError || !data) return <div className="py-40 text-center text-red-500 bg-[#07140f] h-screen font-black uppercase italic">Error Loading Data</div>;

  const specialization = data.specializations;
  const workoutList = data.workouts?.workouts || [];
  const heroStats = workoutList[0];

  return (
    <div className="min-h-screen bg-[#07140f] text-white font-sans selection:bg-[#00ff94] selection:text-black">
      
      <div className="max-w-7xl mx-auto px-4 md:px-6 pt-6">
        <div className="relative h-[450px] md:h-[550px] overflow-hidden rounded-[30px] md:rounded-[40px] border border-white/5 shadow-2xl">
          <img
            src={specialization?.imageUrl}
            className="w-full h-full object-cover"
            alt={specialization?.name}
          />
          
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent flex flex-col justify-center px-6 md:px-20">
            <div className="flex items-center gap-2 mb-4">
               <div className="w-2 h-2 rounded-full bg-[#00ff94] animate-pulse" />
               <span className="text-[#00ff94] text-[10px] font-black tracking-widest uppercase italic">Recommended Session</span>
            </div>

            <h1 className="text-4xl md:text-7xl font-black mb-6 max-w-2xl leading-tight uppercase italic tracking-tighter">
              {specialization?.name} <br />
              <span className="text-gray-900 bg-white px-2">Program</span>
            </h1>

            <div className="flex items-center gap-4 md:gap-6 mb-10">
              <div className="flex items-center gap-3 bg-black/60 backdrop-blur-xl px-4 py-2 rounded-2xl border border-white/10">
                <Clock size={18} className="text-[#00ff94]" />
                <span className="text-xs md:text-sm font-black italic uppercase tracking-tighter">
                  {heroStats?.duration || 0} Mins
                </span>
              </div>
              <div className="flex items-center gap-3 bg-black/60 backdrop-blur-xl px-4 py-2 rounded-2xl border border-white/10">
                <Flame size={18} className="text-orange-500" />
                <span className="text-xs md:text-sm font-black italic uppercase tracking-tighter">
                  {heroStats?.caloriesBurn || 0} Cal
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <button 
                onClick={() => navigate(`/select-workouts/${specialization?.id}`)}
                className="px-8 py-4 bg-[#00ff94] text-black font-black rounded-2xl flex items-center gap-2 hover:shadow-[0_0_30px_rgba(0,255,148,0.5)] transition-all uppercase italic text-[10px] tracking-widest"
              >
                Get Started <ChevronRight size={16} />
              </button>
          
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16 grid lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-[#0d1f17] p-8 md:p-12 rounded-[2.5rem] border border-white/5 relative overflow-hidden h-full">
             <div className="absolute top-0 right-0 w-64 h-64 bg-[#00ff94]/5 blur-[100px] pointer-events-none" />
             <div className="flex items-center gap-3 mb-8 relative z-10">
                <Zap size={24} className="text-[#00ff94]" />
                <h2 className="text-2xl font-black uppercase italic tracking-tight leading-none">About Specialization</h2>
             </div>
             <p className="text-gray-400 text-lg leading-relaxed italic relative z-10 font-medium">
                {specialization?.description}
             </p>
          </div>
        </div>

        <div className="bg-[#0d1f17] p-8 md:p-10 rounded-[2.5rem] border border-white/5">
          <div className="flex items-center gap-3 mb-10">
             <div className="w-4 h-4 bg-[#00ff94] rounded-sm" />
             <h2 className="text-2xl font-black uppercase italic tracking-tight leading-none">Structure</h2>
          </div>

          <div className="space-y-0 relative">
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            {workoutList.map((wk: unknown, index: number) => (
              <div key={wk.id} className="relative flex gap-6 pb-12 last:pb-0">
                {index !== workoutList.length - 1 && (
                  <div className="absolute left-[19px] top-10 bottom-0 w-[1px] bg-white/10" />
                )}
                <div className="relative z-10 w-10 h-10 rounded-full bg-black flex items-center justify-center border border-white/10 text-[#00ff94] font-black text-[10px]">
                  {String(index + 1).padStart(2, '0')}
                </div>
                <div className="flex-1 pt-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-black uppercase italic text-sm text-white tracking-tighter">{wk.title}</h3>
                    <span className="text-[#00ff94] text-[9px] font-black uppercase tracking-widest">{wk.duration} Min</span>
                  </div>
                  <p className="text-gray-500 text-xs italic font-medium leading-relaxed">{wk.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ================= AI PLAN CTA ================= */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 pb-24">
         <div className="bg-gradient-to-r from-[#132a1e] to-[#0d1f17] p-10 md:p-14 rounded-[2.5rem] border border-white/5 flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="max-w-xl text-center md:text-left">
                <span className="bg-[#00ff94]/10 text-[#00ff94] text-[9px] font-black uppercase px-3 py-1 rounded-full border border-[#00ff94]/20 italic">Fitora Intelligence</span>
                <h3 className="text-3xl md:text-5xl font-black mt-6 uppercase italic leading-none tracking-tighter">Make plan with <br /><span className="text-[#00ff94]">AI workout</span></h3>
                <p className="text-gray-500 text-sm mt-6 italic font-medium leading-relaxed">Let our engine analyze your metrics and create a personalized session sequence based on this specialization.</p>
            </div>
            <button className="w-full md:w-auto bg-white text-black px-12 py-5 rounded-2xl font-black uppercase italic text-xs tracking-widest shadow-2xl hover:scale-105 transition-all">
                Launch AI Engine
            </button>
         </div>
      </div>
    </div>
  );
}