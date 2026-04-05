import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/use-auth-store";
import { User, LogOut, ChevronDown, ActivityIcon, Zap } from "lucide-react";
import { logoutUser } from "../../api/auth.api";
import { useUser } from "../../hooks/user/use-user";
import { useSubscriptionStatus } from "../../hooks/user/subscription/check-plan-status";
import { queryClient } from "../../constants/query-client";
import { NotificationBell } from "../../components/common/NotificationBell";

export const UserHeader = () => {
  const { logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useUser();

  const { data: statusData } = useSubscriptionStatus();
  const isPremium = !!statusData?.isPremium;
  const activePlanName = statusData?.subscription?.planName;

  const avatarSrc =
    user?.profileImage ||
    (user?.gender === "male"
      ? "/avatarMale.png"
      : user?.gender === "female"
        ? "/avatarFemale.png"
        : "/default-avatar.png");

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error("Logout API failed:", error);
    } finally {
      queryClient.clear();
      logout();
      navigate("/", { replace: true });
    }
  };

  const navLinks = [
    { name: "Dashboard", path: "/home" },
    { name: "Workouts", path: "/workouts" },
    { name: "AI Diet & Workout", path: "/diet" },
    { name: "Subscription", path: "/subscription" },
    { name: "Support", path: "/support" },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-[#0d1f17]/90 backdrop-blur-xl border-b border-white/5 h-20">
      <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <ActivityIcon className="w-6 h-6 text-[#00ff94]" />
          <span className="text-white font-bold text-xl italic tracking-tighter uppercase">Fitora</span>
        </Link>

        {/* Navigation */}
        <div className="hidden lg:flex items-center gap-8 text-[11px] font-bold uppercase tracking-widest italic">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`transition-colors hover:text-[#00ff94] ${location.pathname === link.path ? "text-[#00ff94]" : "text-gray-400"
                }`}
            >
              {link.name}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-2">

          {/* Notification Bell */}
          <div className="mr-2">
            <NotificationBell />
          </div>

          {/* Profile Dropdown */}
          <div className="relative group py-4">
            <div className="flex items-center gap-4 cursor-pointer">
              <div className="text-right hidden sm:block">
                <p className="text-[10px] text-white font-black uppercase italic leading-none">
                  {user?.firstName || "User"}
                </p>
                <p className="text-[9px] text-[#00ff94] font-bold uppercase italic tracking-tighter flex items-center justify-end gap-1 mt-1">
                  {isPremium ? (
                    <>
                      <Zap size={8} fill="#00ff94" />
                      {activePlanName || "Pro Member"}
                    </>
                  ) : (
                    user?.role === "trainer" ? "Pro Trainer" : "Free Member"
                  )}
                </p>
              </div>
              <div className="relative">
                <div className="w-10 h-10 rounded-full border-2 border-[#00ff94]/20 p-0.5 overflow-hidden transition-all group-hover:border-[#00ff94]">
                  <img src={avatarSrc} alt="Profile" className="w-full h-full rounded-full object-cover" />
                </div>
                <ChevronDown className="absolute -right-1 -bottom-1 w-3 h-3 bg-[#0d1f17] text-[#00ff94] rounded-full border border-white/10" />
              </div>
            </div>

            {/* Dropdown Content */}
            <div className="absolute right-0 top-full pt-2 opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-200 z-[60]">
              <div className="w-48 bg-[#0a1810] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                <Link to="/profile" className="flex items-center gap-3 px-4 py-4 text-[10px] font-black uppercase italic text-gray-400 hover:bg-white/5 hover:text-[#00ff94] transition-colors border-b border-white/5">
                  <User size={14} /> Profile Settings
                </Link>
                <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-4 text-[10px] font-black uppercase italic text-red-500 hover:bg-red-500/10 transition-colors">
                  <LogOut size={14} /> Logout Session
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </nav>
  );
};