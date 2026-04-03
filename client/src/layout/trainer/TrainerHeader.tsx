import { Link, useNavigate } from "react-router-dom";
import { User, LogOut, ChevronDown, ShieldCheck } from "lucide-react";
import { useAuthStore } from "../../store/use-auth-store";
import { useTrainerProfile } from "../../hooks/trainer/profile/use-trainer-profile";
import { logoutUser } from "../../api/auth.api";
import { queryClient } from "../../constants/query-client";
import { useUser } from "../../hooks/user/use-user";
import { useState } from "react";
import { useNotificationsLogic } from "../../hooks/common/use-notify";

export const TrainerHeader = () => {
  const { logout } = useAuthStore();
  const navigate = useNavigate();
  const { trainer } = useTrainerProfile();
  const { user } = useUser();
  
  // Notification Logic
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const { notifications, unreadCount, markRead } = useNotificationsLogic();

  const avatarSrc =
    trainer?.profileImage ||
    (user?.gender === "male"
      ? "/avatarMale.png"
      : user?.gender === "female"
        ? "/avatarFemale.png"
        : "/default-avatar.png");

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      queryClient.clear();
      logout();
      navigate("/login", { replace: true });
    }
  };

  return (
    <header className="h-20 border-b border-white/5 bg-[#06110d]/50 backdrop-blur-md px-8 flex items-center justify-end gap-6 relative">
      
      {/* --- NOTIFICATION SECTION --- */}
      <div className="relative">
        <button 
          onClick={() => setIsNotifOpen(!isNotifOpen)}
          className={`relative p-2.5 rounded-xl border transition-all group ${
            isNotifOpen 
            ? "bg-[#00ff94]/10 border-[#00ff94] text-[#00ff94]" 
            : "bg-white/5 border-white/10 text-gray-400 hover:text-[#00ff94] hover:border-[#00ff94]/50"
          }`}
        >
          <BellIcon size={20} />
          {unreadCount > 0 && (
            <span className="absolute top-2 right-2 w-2 h-2 bg-[#00ff94] rounded-full border-2 border-[#06110d] animate-pulse shadow-[0_0_10px_#00ff94]" />
          )}
        </button>

        {/* Notification Dropdown */}
        {isNotifOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsNotifOpen(false)} />
            <div className="absolute right-0 mt-4 w-80 max-h-[480px] bg-[#0a1810] border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.7)] z-50 flex flex-col overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="p-4 border-b border-white/5 bg-white/5 flex justify-between items-center">
                <h3 className="text-[10px] font-black uppercase italic text-white tracking-widest">Recent Alerts</h3>
                {unreadCount > 0 && (
                  <span className="text-[9px] bg-[#00ff94] text-black px-2 py-0.5 rounded-full font-bold uppercase">
                    {unreadCount} New
                  </span>
                )}
              </div>

              <div className="overflow-y-auto max-h-[380px] custom-scrollbar">
                {notifications.length === 0 ? (
                  <div className="p-10 text-center text-gray-500 text-[10px] uppercase italic font-bold">No data found</div>
                ) : (
                  notifications.map((n: any) => (
                    <div 
                      key={n.id}
                      onClick={() => {
                        if (!n.isRead) markRead(n.id);
                      }}
                      className={`p-4 border-b border-white/5 cursor-pointer transition-all hover:bg-white/5 ${!n.isRead ? 'bg-[#00ff94]/5' : ''}`}
                    >
                      <div className="flex justify-between items-start gap-2">
                        <p className={`text-[11px] uppercase italic tracking-tight leading-tight ${!n.isRead ? 'text-[#00ff94] font-black' : 'text-gray-300 font-bold'}`}>
                          {n.title}
                        </p>
                        {!n.isRead && <div className="w-1.5 h-1.5 bg-[#00ff94] rounded-full shadow-[0_0_8px_#00ff94] mt-1 shrink-0" />}
                      </div>
                      <p className="text-[10px] text-gray-400 mt-1 font-medium leading-relaxed">
                        {n.message}
                      </p>
                      <p className="text-[8px] text-gray-600 mt-2 font-black uppercase italic">
                        {new Date(n.createdAt).toLocaleTimeString()} • {new Date(n.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* --- PROFILE SECTION --- */}
      <div className="relative group">
        <div className="flex items-center gap-4 cursor-pointer p-1 pr-3 rounded-2xl hover:bg-white/5 transition-all">
          <div className="text-right hidden sm:block">
            <p className="text-[10px] text-white font-black uppercase italic leading-none">
              {trainer?.firstName || "Trainer"}
            </p>
            <p className="text-[9px] text-[#00ff94] font-bold uppercase italic tracking-tighter flex items-center justify-end gap-1 mt-1">
              <ShieldCheck size={10} fill="#00ff94" className="text-[#06110d]" />
              Fitora Trainer
            </p>
          </div>

          <div className="relative">
            <div className="w-10 h-10 rounded-full border-2 border-[#00ff94]/20 p-0.5 overflow-hidden group-hover:border-[#00ff94] transition-all shadow-[0_0_15px_rgba(0,255,148,0.1)]">
              <img src={avatarSrc} alt="Profile" className="w-full h-full rounded-full object-cover" />
            </div>
            <div className="absolute -right-1 -bottom-1 w-4 h-4 bg-[#0d1f17] rounded-full border border-white/10 flex items-center justify-center">
              <ChevronDown size={10} className="text-[#00ff94]" />
            </div>
          </div>
        </div>

        {/* Dropdown Menu */}
        <div className="absolute right-0 top-full pt-2 opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-200 z-[70]">
          <div className="w-52 bg-[#0a1810] border border-white/10 rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            <Link to="/trainer/profile" className="flex items-center gap-3 px-5 py-4 text-[10px] font-black uppercase italic text-gray-400 hover:bg-[#00ff94]/10 hover:text-[#00ff94] transition-colors border-b border-white/5">
              <User size={14} /> View Profile
            </Link>
            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-5 py-4 text-[10px] font-black uppercase italic text-red-500 hover:bg-red-500/10 transition-colors">
              <LogOut size={14} /> End Session
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

const BellIcon = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
);