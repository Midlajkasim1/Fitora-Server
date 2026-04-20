// import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryProvider } from './providers/query-provider'; 
import { GoogleOAuthProvider } from "@react-oauth/google";
import App from './App';
import './index.css';
import '@livekit/components-styles';
import { AuthProvider } from './providers/AuthProvider';
import { ToastProvider } from './providers/ToastProvider';
import api from './api/axios';
import { attachLogicToApi } from './api/interceptor';
import { NotificationProvider } from './providers/NotificationProvider';

attachLogicToApi(api);
createRoot(document.getElementById('root')!).render(
  // <StrictMode>
    <QueryProvider> 
      <AuthProvider>
        <NotificationProvider>
        <ToastProvider/>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <App />
      </GoogleOAuthProvider>
      </NotificationProvider>
      </AuthProvider>
    </QueryProvider>
  /* </StrictMode> */
);
