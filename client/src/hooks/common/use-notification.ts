import { createContext, useContext } from 'react';
import { Socket } from 'socket.io-client';

export const NotificationContext = createContext<Socket | null>(null);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  return context;
};