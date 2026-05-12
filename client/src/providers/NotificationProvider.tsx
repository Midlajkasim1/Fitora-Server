import React, { useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '../store/use-auth-store';
import { useQueryClient } from '@tanstack/react-query'; 
import toast from 'react-hot-toast';
import { NotificationContext } from '../hooks/common/use-notification';
import { useChatStore } from '../store/use-chat-store';

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const user = useAuthStore((state) => state.user);
  const queryClient = useQueryClient(); 
  
  const socketRef = useRef<Socket | null>(null);
  const [activeSocket, setActiveSocket] = useState<Socket | null>(null);

  useEffect(() => {
    // Auth is cookie-based (httpOnly). The browser sends cookies automatically.
    // We only need user?.id to know the user is authenticated.
    if (user?.id && !socketRef.current) {
      const socketUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:4000';
      console.log('🔌 Attempting Socket Connection to:', socketUrl);

      const newSocket = io(socketUrl, {
        withCredentials: true,        // sends the httpOnly accessToken cookie
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: 10,
        reconnectionDelay: 1000,
      });

      newSocket.on('connect', () => {
        console.log('✅ Notification Socket Connected:', newSocket.id);
        setActiveSocket(newSocket);
      });

      // DEBUG: Listen for any incoming event to see what the server is sending
      newSocket.onAny((eventName, ...args) => {
        console.log(`📡 Incoming Event [${eventName}]:`, args);
      });

      newSocket.on('connect_error', (error) => {
        console.error('❌ Notification Socket Connection Error:', error.message);
        if (error.message === "Unauthorized: Invalid or expired token") {
          setActiveSocket(null);
        }
      });

      newSocket.on('disconnect', (reason) => {
        console.warn('⚠️ Notification Socket Disconnected:', reason);
        if (reason === "io server disconnect") {
          // the disconnection was initiated by the server, you need to reconnect manually
          newSocket.connect();
        }
        setActiveSocket(null);
      });

      newSocket.on('notification_received', (data: { title: string; message: string }) => {
        toast.success(`${data.title}: ${data.message}`, {
          style: { background: '#1A1D21', color: '#fff', border: '1px solid #2D3139' },
        });

        queryClient.invalidateQueries({ queryKey: ["notifications"], refetchType: "all" });
      });

      newSocket.on('receive_message', (data: any) => {
        const msg = data?.data;
        queryClient.invalidateQueries({ queryKey: ["chat-partners"], refetchType: "all" });
        queryClient.invalidateQueries({ queryKey: ["chat-history"], refetchType: "all" });
        
        if (msg) {
          const state = useChatStore.getState();
          if (!state.isOpen || state.selectedTrainerId !== msg.senderId) {
             state.setHasUnread(true);
             toast.success(`New message received`, {
               style: { background: '#0a1810', color: '#fff', border: '1px solid #00ff94' },
               icon: '💬',
             });
          }
        }
      });

      newSocket.on('session-started', (data: { slotId: string, message: string }) => {
        toast((t) => (
          <div className="flex flex-col gap-2">
            <p className="text-white font-bold text-xs uppercase italic">{data.message}</p>
            <button 
              onClick={() => {
                toast.dismiss(t.id);
                window.location.href = `/video-call/${data.slotId}`;
              }}
              className="bg-[#00ff94] text-black font-black text-[10px] py-2 rounded-lg uppercase italic"
            >
              Join Session Now
            </button>
          </div>
        ), {
          duration: 10000,
          style: { background: '#0d1a16', border: '2px solid #00ff94' },
        });
      });

      newSocket.on('SESSION_FINISHED', (data: { slotId: string, message: string }) => {
        toast.success(data.message || "Session ended.", {
          style: { background: '#0d1a16', border: '1px solid #00ff94', color: '#fff' }
        });
        
        queryClient.invalidateQueries({ queryKey: ["trainer-upcoming-slots"], refetchType: 'all' });
        queryClient.invalidateQueries({ queryKey: ["trainerDashboard"], refetchType: 'all' });
        queryClient.invalidateQueries({ queryKey: ["upcoming-sessions"], refetchType: 'all' });
        queryClient.invalidateQueries({ queryKey: ["premium-dashboard"], refetchType: 'all' });
        
        setTimeout(() => {
          if (window.location.pathname.includes(`/video-call/${data.slotId}`)) {
            window.location.href = `/session-review/${data.slotId}`;
          }
        }, 2000);
      });

      socketRef.current = newSocket;
    }

    return () => {
      if (socketRef.current) {
        console.log('🔌 Disconnecting Notification Socket');
        socketRef.current.disconnect();
        socketRef.current = null;
        setActiveSocket(null);
      }
    };
  }, [user?.id, queryClient]);

  return (
    <NotificationContext.Provider value={activeSocket}>
      {children}
    </NotificationContext.Provider>
  );
};