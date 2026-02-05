import { Clock, Mail, ShieldCheck, LogOut, ChevronRight } from "lucide-react";
import { useAuthStore } from "../../../../store/use-auth-store";
import { logoutUser } from "../../../../api/auth.api";
export default function WaitingApprovalPage() {
  const { user, logout } = useAuthStore();

const handleLogout = async () => {
    try {
      await logoutUser(); 
    } catch (error) {
      console.error("Logout API failed:", error);
    } finally {
      logout(); 
    window.location.replace("/");    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-[#0a1810] text-white selection:bg-[#00ff94] selection:text-[#0d1f17]">
      <main className="flex-1 flex items-center justify-center py-12 px-4 relative overflow-hidden">
        
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[400px] md:w-[700px] h-[300px] bg-[#00ff94]/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="w-full max-w-2xl relative z-10">
          
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#00ff94]/10 border border-[#00ff94]/20 mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00ff94] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00ff94]"></span>
              </span>
              <span className="text-[#00ff94] text-[10px] font-black uppercase tracking-widest italic">Application Under Review</span>
            </div>
            
            <h1 className="text-3xl md:text-5xl font-black italic tracking-tighter uppercase mb-4">
              Almost There, <span className="text-[#00ff94]">{user?.firstName || 'Coach'}</span>
            </h1>
            <p className="text-gray-400 text-xs md:text-sm font-medium italic max-w-md mx-auto leading-relaxed">
              Our specialists are currently verifying your certifications. This process ensures the highest quality of trainers on our platform.
            </p>
          </div>

          <div className="bg-[#0d1f17]/80 backdrop-blur-3xl rounded-[2.5rem] p-8 md:p-10 border border-white/5 shadow-2xl">
            <div className="space-y-8">
              
              <div className="flex items-start gap-5 p-6 rounded-2xl bg-[#0a1810] border border-white/5">
                <div className="w-12 h-12 rounded-xl bg-[#00ff94]/10 flex items-center justify-center shrink-0">
                  <Mail className="w-6 h-6 text-[#00ff94]" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-white font-bold text-sm italic uppercase tracking-tight">Check Your Inbox</h3>
                  <p className="text-gray-500 text-[11px] leading-relaxed italic">
                    A confirmation of your submission has been sent to <span className="text-[#00ff94] font-bold">{user?.email}</span>. We'll notify you there as soon as your profile is approved.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] italic ml-1">Next Steps</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-4 rounded-xl border border-white/5 bg-white/2 flex items-center gap-3 opacity-50">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-[10px] font-bold uppercase italic text-gray-400">Verifying Identity</span>
                  </div>
                  <div className="p-4 rounded-xl border border-[#00ff94]/30 bg-[#00ff94]/5 flex items-center gap-3">
                    <ShieldCheck className="w-4 h-4 text-[#00ff94]" />
                    <span className="text-[10px] font-bold uppercase italic text-[#00ff94]">Reviewing Credentials</span>
                  </div>
                </div>
              </div>

              <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  disabled
                  className="flex-1 bg-white/5 text-gray-500 font-black py-4 rounded-2xl italic uppercase text-xs tracking-widest cursor-not-allowed border border-white/5 flex items-center justify-center gap-2"
                >
                  Dashboard Locked <ChevronRight className="w-4 h-4" />
                </button>
                
                <button
                  onClick={handleLogout}
                  className="px-8 bg-transparent text-red-500 hover:bg-red-500/10 font-black py-4 rounded-2xl italic uppercase text-xs tracking-widest transition-all border border-red-500/20 flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </div>
            </div>
          </div>

          <p className="text-center text-gray-600 text-[10px] uppercase font-bold tracking-widest mt-10 italic">
            Average Review Time: 24-48 Hours
          </p>
        </div>
      </main>
    </div>
  );
}