import { useState } from "react";
import { useNotificationsLogic } from "../../hooks/common/use-notify";

export const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, unreadCount, markRead } = useNotificationsLogic();

  return (
    <div className="relative">
      {/* Bell Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full hover:bg-white/10 transition-all text-gray-400 hover:text-white"
      >
        <span className="text-2xl">🔔</span>
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-bold text-black border-2 border-[#0D1117]">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-3 w-80 max-h-[450px] overflow-hidden rounded-2xl bg-[#0D1117] border border-[#1F2937] shadow-2xl z-50 flex flex-col animate-in fade-in zoom-in duration-200">
            <div className="p-4 border-b border-[#1F2937] flex justify-between items-center bg-[#161B22]">
              <h3 className="text-white font-bold">Notifications</h3>
              <button className="text-[10px] text-emerald-500 uppercase font-bold tracking-widest hover:underline">Mark all as read</button>
            </div>

            <div className="overflow-y-auto max-h-[350px] scrollbar-hide">
              {notifications.length === 0 ? (
                <div className="p-10 text-center text-gray-500 text-sm italic">No recent activity.</div>
              ) : (
                notifications.map((n: any) => (
                  <div 
                    key={n.id}
                    onClick={() => {
                      if (!n.isRead) markRead(n.id);
                    }}
                    className={`p-4 border-b border-[#1F2937] cursor-pointer transition-colors ${!n.isRead ? 'bg-emerald-500/[0.03] border-l-2 border-l-emerald-500' : 'hover:bg-white/[0.02]'}`}
                  >
                    <div className="flex justify-between items-start">
                      <p className={`text-sm ${!n.isRead ? 'text-white font-semibold' : 'text-gray-400'}`}>
                        {n.title}
                      </p>
                      {!n.isRead && <div className="h-2 w-2 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.6)]" />}
                    </div>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">{n.message}</p>
                    <p className="text-[10px] text-gray-600 mt-2 uppercase font-medium">
                      {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(n.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))
              )}
            </div>
            
            <div className="p-3 bg-[#161B22] border-t border-[#1F2937] text-center">
                <button className="text-xs text-gray-400 hover:text-white transition-colors">View All Notifications</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};