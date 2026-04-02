import { Link, useNavigate } from "react-router-dom";
import { Bell, User, LogOut, ChevronDown, ShieldCheck } from "lucide-react";
import { useAuthStore } from "../../store/use-auth-store";
import { useTrainerProfile } from "../../hooks/trainer/profile/use-trainer-profile";
import { logoutUser } from "../../api/auth.api";
import { queryClient } from "../../constants/query-client";
import { useUser } from "../../hooks/user/use-user";


export const TrainerHeader = () => {
  const { logout } = useAuthStore();
  const navigate = useNavigate();
  const { trainer } = useTrainerProfile();
    const { user } = useUser();
  
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
    <header className="h-20 border-b border-white/5 bg-[#06110d]/50 backdrop-blur-md px-8 flex items-center justify-end gap-6">
      
      {/* Notification Icon */}
      <button className="relative p-2.5 bg-white/5 rounded-xl border border-white/10 text-gray-400 hover:text-[#00ff94] hover:border-[#00ff94]/50 transition-all group">
        <Bell size={20} />
        {/* Notification Dot */}
        <span className="absolute top-2 right-2 w-2 h-2 bg-[#00ff94] rounded-full border-2 border-[#06110d] animate-pulse" />
      </button>

      {/* Profile Section */}
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
              <img 
                src={avatarSrc} 
                alt="Profile" 
                className="w-full h-full rounded-full object-cover" 
              />
            </div>
            <div className="absolute -right-1 -bottom-1 w-4 h-4 bg-[#0d1f17] rounded-full border border-white/10 flex items-center justify-center">
              <ChevronDown size={10} className="text-[#00ff94]" />
            </div>
          </div>
        </div>

        {/* Dropdown Menu */}
        <div className="absolute right-0 top-full pt-2 opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-200 z-[70]">
          <div className="w-52 bg-[#0a1810] border border-white/10 rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            <Link 
              to="/trainer/profile" 
              className="flex items-center gap-3 px-5 py-4 text-[10px] font-black uppercase italic text-gray-400 hover:bg-[#00ff94]/10 hover:text-[#00ff94] transition-colors border-b border-white/5"
            >
              <User size={14} /> View Profile
            </Link>
            <button 
              onClick={handleLogout} 
              className="w-full flex items-center gap-3 px-5 py-4 text-[10px] font-black uppercase italic text-red-500 hover:bg-red-500/10 transition-colors"
            >
              <LogOut size={14} /> End Session
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};