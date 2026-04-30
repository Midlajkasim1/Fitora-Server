import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, Users, Calendar, 
  MessageSquare, DollarSign, LogOut, 
  ActivityIcon, ShieldCheck, User as UserIcon
} from 'lucide-react';
import { useAuthStore } from "../../store/use-auth-store"; 
import { useChatStore } from "../../store/use-chat-store";
import { useEffect } from "react";
import { useSocket } from "../../hooks/common/use-notification";
import { logoutUser } from "../../api/auth.api";
import { queryClient } from "../../constants/query-client";
import { useTrainerProfile } from "../../hooks/trainer/profile/use-trainer-profile";
import { useUser } from "../../hooks/user/use-user";

const menuItems = [
  { name: 'Dashboard', path: '/trainer/dashboard', icon: LayoutDashboard },
  { name: 'Clients', path: '/trainer/clients', icon: Users },
  { name: 'Sessions', path: '/trainer/session', icon: Calendar },
  { name: 'Messages', path: '/trainer/messages', icon: MessageSquare },
  { name: 'Earnings', path: '/trainer/wallet', icon: DollarSign },
];

const Sidebar = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, setLoggingOut } = useAuthStore();
  const { openChat, hasUnread, setHasUnread, isOpen: isChatOpen } = useChatStore();
  const socket = useSocket();
  const { trainer } = useTrainerProfile();
  const { user } = useUser();

  const avatarSrc =
    trainer?.profileImage ||
    (user?.gender === "male"
      ? "/avatarMale.png"
      : user?.gender === "female"
        ? "/avatarFemale.png"
        : "/default-avatar.png");

  // Listen for new messages to trigger the "green dot" notification
  useEffect(() => {
    if (!socket) return;
    
    const handleNewMessage = () => {
      if (!isChatOpen) {
        setHasUnread(true);
      }
    };

    socket.on("receive_message", handleNewMessage);
    return () => {
      socket.off("receive_message", handleNewMessage);
    };
  }, [socket, isChatOpen, setHasUnread]);

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await logoutUser();
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      queryClient.clear();
      logout();
      navigate("/login", { replace: true });
    }
  };

  return (
    <aside className={`w-64 h-screen bg-[#0d1f17] border-r border-white/5 flex flex-col fixed left-0 top-0 overflow-y-auto z-[100] transition-transform duration-300 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      {/* Logo Section */}
      <div className="p-8 flex items-center justify-between gap-3">
        <Link to="/trainer/dashboard" className="flex items-center gap-2">
          <ActivityIcon className="w-6 h-6 text-[#00ff94]" />
          <span className="text-white font-bold text-xl italic tracking-tighter uppercase">Fitora</span>
        </Link>
        
        {/* Close button for mobile */}
        <button 
          onClick={onClose}
          className="lg:hidden p-2 text-gray-500 hover:text-white"
        >
          <LogOut size={18} className="rotate-180" />
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 space-y-1">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          const isMessages = item.name === 'Messages';
          
          return (
            <Link
              key={item.name}
              to={item.path}
              onClick={(e) => {
                if (isMessages) {
                  e.preventDefault();
                  openChat();
                }
                if (window.innerWidth < 1024) {
                  onClose();
                }
              }}
              className={`flex items-center justify-between gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive 
                ? "bg-[#00ff94] text-black shadow-[0_0_20px_rgba(0,255,148,0.2)]" 
                : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon 
                  size={18} 
                  className={isActive ? "text-black" : "text-gray-500 group-hover:text-[#00ff94]"} 
                />
                <span className="text-[11px] font-bold uppercase tracking-wider italic">
                  {item.name}
                </span>
              </div>

              {/* Green Dot for Messages */}
              {isMessages && hasUnread && !isActive && (
                <div className="w-2 h-2 bg-[#00ff94] rounded-full shadow-[0_0_10px_#00ff94]" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Logout Section */}
      <div className="p-6 border-t border-white/5">
        <button 
          onClick={handleLogout} 
          className="flex items-center gap-3 px-4 py-3 w-full text-red-500 hover:bg-red-500/10 rounded-xl transition-all group"
        >
          <LogOut size={18} className="group-hover:translate-x-1 transition-transform" />
          <span className="text-[11px] font-bold uppercase italic">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;