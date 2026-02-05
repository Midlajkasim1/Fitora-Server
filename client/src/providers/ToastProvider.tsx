import { Toaster } from 'react-hot-toast';

export const ToastProvider = () => {
  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      toastOptions={{
        style: {
          background: '#0a1810',
          color: '#fff',
          border: '1px solid rgba(0, 255, 148, 0.2)',
          fontSize: '12px',
          fontStyle: 'italic',
          padding: '12px 24px',
          borderRadius: '12px',
        },
        success: {
          duration: 3000,
          iconTheme: {
            primary: '#00ff94',
            secondary: '#0a1810',
          },
        },
        error: {
          duration: 4000,
          iconTheme: {
            primary: '#ff4b4b',
            secondary: '#0a1810',
          },
        },
      }}
    />
  );
};