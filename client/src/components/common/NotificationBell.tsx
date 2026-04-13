import { useState } from "react";
import { useNotificationsLogic } from "../../hooks/common/use-notify";
import { Bell, CheckCheck, Trash2 } from "lucide-react";

export const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { 
    notifications, 
    unreadCount, 
    markRead, 
    markAllRead, 
    clearAll 
  } = useNotificationsLogic();

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2.5 rounded-xl border transition-all group ${
          isOpen 
          ? "bg-[#00ff94]/10 border-[#00ff94] text-[#00ff94]" 
          : "bg-white/5 border-white/10 text-gray-400 hover:text-[#00ff94] hover:border-[#00ff94]/50"
        }`}
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-2 right-2 w-2 h-2 bg-[#00ff94] rounded-full border-2 border-[#06110d] animate-pulse shadow-[0_0_10px_#00ff94]" />
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-[90]" onClick={() => setIsOpen(false)} />
          
          <div className="absolute right-0 mt-4 w-80 max-h-[480px] bg-[#0a1810] border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.7)] z-[100] flex flex-col overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
            
            {/* HEADER */}
            <div className="p-4 border-b border-white/5 bg-white/5 flex justify-between items-center">
              <h3 className="text-[10px] font-black uppercase italic text-white tracking-widest">Recent Alerts</h3>
              
              <div className="flex items-center gap-3">
                {unreadCount > 0 && (
                  <button 
                    onClick={() => markAllRead()}
                    className="flex items-center gap-1 text-[9px] font-black uppercase italic text-[#00ff94] hover:text-white transition-colors"
                  >
                    <CheckCheck size={12} />
                    Read All
                  </button>
                )}
                <span className="text-[9px] bg-[#00ff94] text-black px-2 py-0.5 rounded-full font-bold uppercase">
                  {unreadCount} New
                </span>
              </div>
            </div>

            {/* NOTIFICATIONS LIST */}
            <div className="overflow-y-auto max-h-[380px] custom-scrollbar scrollbar-hide">
              {notifications.length === 0 ? (
                <div className="p-10 text-center text-gray-500 text-[10px] uppercase italic font-bold">No data found</div>
              ) : (
                notifications.map((n: any) => (
                  <div 
                    key={n.id}
                    onClick={() => {
                      if (!n.isRead) markRead(n.id);
                    }}
                    className={`p-4 border-b border-white/5 cursor-pointer transition-all hover:bg-white/5 ${!n.isRead ? 'bg-[#00ff94]/5 border-l-2 border-l-[#00ff94]' : ''}`}
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
            
            {/* FOOTER */}
            {notifications.length > 0 && (
              <div className="p-3 bg-[#06110d] border-t border-white/5 text-center">
                  <button 
                    onClick={() => clearAll()}
                    className="flex items-center justify-center w-full gap-2 text-[9px] font-black uppercase italic text-red-500/60 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={12} />
                    Clear All Notifications
                  </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};