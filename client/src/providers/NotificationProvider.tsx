import React, { useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '../store/use-auth-store';
import toast from 'react-hot-toast';
import { NotificationContext } from '../hooks/common/use-notification';

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const user = useAuthStore((state) => state.user);
  
  // 1. Use a Ref to hold the actual socket instance. 
  // This prevents multiple connections during re-renders.
  const socketRef = useRef<Socket | null>(null);
  
  // 2. Use state to store the "active" socket for the Provider to share.
  const [activeSocket, setActiveSocket] = useState<Socket | null>(null);

  useEffect(() => {
    // Only run if we have a user and no existing socket in the Ref
    if (user?.id && !socketRef.current) {
      const newSocket = io("http://localhost:4000", {
        query: { userId: user.id },
        transports: ['websocket'],
      });

      newSocket.on('connect', () => {
        console.log('✅ Notification Socket Connected');
        // ✅ Moving setState inside a callback (asynchronous) 
        // stops the "cascading render" error.
        setActiveSocket(newSocket);
      });

      newSocket.on('notification_received', (data: { title: string; message: string }) => {
        toast.success(`${data.title}: ${data.message}`, {
          style: {
            background: '#1A1D21',
            color: '#fff',
            border: '1px solid #2D3139'
          },
        });
      });

      socketRef.current = newSocket;
    }

    // Cleanup: Close the socket when user logs out or component unmounts
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setActiveSocket(null);
      }
    };
  }, [user?.id]); // Only watch for user ID changes

  return (
    <NotificationContext.Provider value={activeSocket}>
      {children}
    </NotificationContext.Provider>
  );
};