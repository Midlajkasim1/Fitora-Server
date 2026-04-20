import React, { useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '../store/use-auth-store';
import { useQueryClient } from '@tanstack/react-query'; 
import toast from 'react-hot-toast';
import { NotificationContext } from '../hooks/common/use-notification';

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const user = useAuthStore((state) => state.user);
  const queryClient = useQueryClient(); 
  
  const socketRef = useRef<Socket | null>(null);
  const [activeSocket, setActiveSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (user?.id && !socketRef.current) {
      const newSocket = io(import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || "http://localhost:4000", {
        auth: { token: localStorage.getItem('token') }, // Pass token for backend auth
        transports: ['websocket'],
      });

      newSocket.on('connect', () => {
        console.log('✅ Notification Socket Connected');
        setActiveSocket(newSocket);
      });

      newSocket.on('notification_received', (data: { title: string; message: string }) => {
        toast.success(`${data.title}: ${data.message}`, {
          style: { background: '#1A1D21', color: '#fff', border: '1px solid #2D3139' },
        });

        queryClient.invalidateQueries({ queryKey: ["notifications"],refetchType:"all" });
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

      socketRef.current = newSocket;
    }

    return () => {
      if (socketRef.current) {
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