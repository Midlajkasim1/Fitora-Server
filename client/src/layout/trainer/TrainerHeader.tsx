import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, LogOut, ChevronDown, ShieldCheck, Menu, ActivityIcon } from "lucide-react";
import { useAuthStore } from "../../store/use-auth-store";
import { useTrainerProfile } from "../../hooks/trainer/profile/use-trainer-profile";
import { logoutUser } from "../../api/auth.api";
import { queryClient } from "../../constants/query-client";
import { useUser } from "../../hooks/user/use-user";
import { NotificationBell } from "../../components/common/NotificationBell";

export const TrainerHeader = ({ onMenuClick }: { onMenuClick?: () => void }) => {
  const { logout, setLoggingOut } = useAuthStore();
  const navigate = useNavigate();
  const { trainer } = useTrainerProfile();
  const { user } = useUser();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const avatarSrc =
    trainer?.profileImage ||
    (user?.gender === "male"
      ? "/avatarMale.png"
      : user?.gender === "female"
        ? "/avatarFemale.png"
        : "/default-avatar.png");

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
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
    // ✅ Added z-[60] to ensure header is above page content
    <header className="h-20 border-b border-white/5 bg-[#06110d] backdrop-blur-2xl sticky top-0 w-full z-[60]">
      <div className="w-full flex items-center justify-between h-full px-3 md:px-8">
        <div className="flex items-center gap-2 md:gap-4 shrink-0">
          {/* Mobile Menu Toggle */}
          <button 
            onClick={onMenuClick}
            className="p-2 -ml-2 text-gray-400 hover:text-white lg:hidden transition-colors shrink-0"
          >
            <Menu className="w-[22px] h-[22px] md:w-6 md:h-6" />
          </button>
          
          {/* Logo (Visible on mobile since sidebar is hidden) */}
          <Link to="/trainer/dashboard" className="flex lg:hidden items-center gap-1.5 md:gap-2 shrink-0">
            <ActivityIcon className="w-5 h-5 md:w-6 md:h-6 text-[#00ff94] shrink-0" />
            <span className="text-white font-bold text-lg md:text-xl italic tracking-tighter uppercase hidden xs:block">Fitora</span>
          </Link>
        </div>

        <div className="flex items-center gap-2 md:gap-6 shrink-0">
          <NotificationBell />

          {/* Profile Section */}
          <div className="relative group shrink-0" ref={dropdownRef}>
            <div 
              className="flex items-center gap-2 md:gap-4 cursor-pointer p-0.5 md:p-1 rounded-2xl hover:bg-white/5 transition-all shrink-0"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
            >
              <div className="text-right hidden sm:block shrink-0">
                <p className="text-[10px] text-white font-black uppercase italic leading-none">
                  {trainer?.firstName || "Trainer"}
                </p>
                <p className="text-[9px] text-[#00ff94] font-bold uppercase italic tracking-tighter flex items-center justify-end gap-1 mt-1">
                  <ShieldCheck size={10} fill="#00ff94" className="text-[#06110d]" />
                  Fitora Trainer
                </p>
              </div>

              <div className="relative shrink-0">
                <div className="w-9 h-9 md:w-10 md:h-10 rounded-full border-2 border-[#00ff94]/20 p-0.5 overflow-hidden group-hover:border-[#00ff94] transition-all">
                  <img src={avatarSrc} alt="Profile" className="w-full h-full rounded-full object-cover" />
                </div>
                <div className="absolute -right-1 -bottom-1 w-4 h-4 bg-[#0d1f17] rounded-full border border-white/10 flex items-center justify-center">
                  <ChevronDown size={10} className={`text-[#00ff94] transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
                </div>
              </div>
            </div>

            {/* Dropdown Menu */}
            <div className={`absolute right-0 top-full pt-2 transition-all duration-200 z-[70] ${
              isProfileOpen 
                ? 'opacity-100 visible translate-y-0' 
                : 'opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0'
            }`}>
              <div className="w-52 bg-[#0a1810] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                <Link 
                  to="/trainer/profile" 
                  onClick={() => setIsProfileOpen(false)}
                  className="flex items-center gap-3 px-5 py-4 text-[10px] font-black uppercase italic text-gray-400 hover:bg-[#00ff94]/10 hover:text-[#00ff94] transition-colors border-b border-white/5"
                >
                  <User size={14} /> View Profile
                </Link>
                <button 
                  onClick={() => {
                    setIsProfileOpen(false);
                    handleLogout();
                  }}
                  className="w-full flex items-center gap-3 px-5 py-4 text-[10px] font-black uppercase italic text-red-500 hover:bg-red-500/10 transition-colors"
                >
                  <LogOut size={14} /> End Session
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};