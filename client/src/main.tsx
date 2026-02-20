// import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryProvider } from './providers/query-provider'; 
import { GoogleOAuthProvider } from "@react-oauth/google";
import App from './App';
import './index.css';
import { AuthProvider } from './providers/AuthProvider';
import { ToastProvider } from './providers/ToastProvider';

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
    <QueryProvider> 
      <AuthProvider>
        <ToastProvider/>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <App />
      </GoogleOAuthProvider>
      </AuthProvider>
    </QueryProvider>
  /* </StrictMode> */
);
