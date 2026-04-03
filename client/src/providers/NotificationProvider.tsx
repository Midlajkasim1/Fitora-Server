import React, { useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '../store/use-auth-store';
import { useQueryClient } from '@tanstack/react-query'; // ✅ Import this
import toast from 'react-hot-toast';
import { NotificationContext } from '../hooks/common/use-notification';

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const user = useAuthStore((state) => state.user);
  const queryClient = useQueryClient(); // ✅ Initialize
  
  const socketRef = useRef<Socket | null>(null);
  const [activeSocket, setActiveSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (user?.id && !socketRef.current) {
      const newSocket = io("http://localhost:4000", {
        query: { userId: user.id },
        transports: ['websocket'],
      });

      newSocket.on('connect', () => {
        console.log('✅ Notification Socket Connected');
        setActiveSocket(newSocket);
      });

      newSocket.on('notification_received', (data: { title: string; message: string }) => {
        // 1. Show the Live Toast
        toast.success(`${data.title}: ${data.message}`, {
          style: { background: '#1A1D21', color: '#fff', border: '1px solid #2D3139' },
        });

        // 2. ✅ CRITICAL: Tell React Query to refresh the background list
        queryClient.invalidateQueries({ queryKey: ["notifications"],refetchType:"all" });
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