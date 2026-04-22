import { Link, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, Users, GraduationCap, 
  Settings, CheckCircle, Wallet, 
  Megaphone, FileText, Dumbbell, LogOut, 
  ActivityIcon,Zap
} from "lucide-react";
import { useAuthStore } from "../../store/use-auth-store";
import { adminLogout } from "../../api/admin.api";

const navItems = [
  { name: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Users", path: "/admin/users", icon: Users },
  { name: "Trainers", path: "/admin/trainers", icon: GraduationCap },
  { name: "Specialisation", path: "/admin/specializations", icon: Settings },
  { name: "Verification", path: "/admin/trainer/verifications", icon: CheckCircle },
  { name: "Subscription", path: "/admin/subscriptions", icon: Zap },
  { name: "Finance Management", path: "/admin/finance", icon: Wallet },
  { name: "Advertisements", path: "/admin/advertisements", icon: Megaphone },
  { name: "Report", path: "/admin/reports", icon: FileText },

  { name: "Workout", path: "/admin/workouts", icon: Dumbbell },
];

export const AdminSidebar = () => {
  const navigate = useNavigate(); 
  const logout = useAuthStore((state) => state.logout);
  const setLoggingOut = useAuthStore((state) => state.setLoggingOut);

const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await adminLogout(); 
    } catch (error) {
      console.error("Logout API failed", error);
    } finally {
      logout(); 

navigate("/admin-portal", { replace: true });     
      }


    }
  
  return (
    <aside className="w-64 h-screen bg-[#0d1f17] border-r border-white/5 flex flex-col fixed left-0 top-0 overflow-y-auto">
      <div className="p-8 flex items-center gap-3">
        <div>
        <Link to="" className="flex items-center gap-2">
            <ActivityIcon className="w-6 h-6 text-[#00ff94]" />
            <span className="text-white font-bold text-xl italic tracking-tighter uppercase">Fitora</span>
          </Link>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive 
                ? "bg-[#00ff94] text-black shadow-[0_0_20px_rgba(0,255,148,0.2)]" 
                : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <item.icon size={18} className={isActive ? "text-black" : "text-gray-500 group-hover:text-[#00ff94]"} />
              <span className="text-[11px] font-bold uppercase tracking-wider italic">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-6 border-t border-white/5">
        <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 w-full text-red-500 hover:bg-red-500/10 rounded-xl transition-all group">
          <LogOut size={18} className="group-hover:translate-x-1 transition-transform" />
          <span className="text-[11px] font-bold uppercase italic">Logout</span>
        </button>
      </div>
    </aside>
  );
};