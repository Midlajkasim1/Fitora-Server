import { useEffect } from "react";
import { getAdminMe } from "../api/admin.api";
import { getMe } from "../api/auth.api";
import { useAuthStore } from "../store/use-auth-store";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { setAuth, logout, setInitialLoading, isInitialLoading } = useAuthStore();

  useEffect(() => {
    const syncAuth = async () => {
      const publicPaths = ['/', '/login', '/register', '/admin-portal', '/verify-otp', '/forgot-password', '/reset-password', '/verify-reset-otp'];
      const currentPath = window.location.pathname;
      const isPublicPath = publicPaths.includes(currentPath);

      try {
        if (isPublicPath) {
          setInitialLoading(false);
          return; 
        }

        const isAdmin = currentPath.startsWith('/admin');
        const response = await (isAdmin ? getAdminMe() : getMe());
        
        if (response.data?.data) {
          setAuth(response.data.data);
        }
      } catch (err: any) {
        if (err.response?.status === 401) {
          logout();
        }
      } finally {
        setInitialLoading(false);
      }
    };

    syncAuth();
  }, [setAuth, logout, setInitialLoading]);

  if (isInitialLoading) {
    return (
      <div className="h-screen w-full bg-[#0a1810] flex flex-col items-center justify-center">
        <div className="text-[#00ff94] font-black italic tracking-widest animate-pulse text-2xl">
          INITIALIZING...
        </div>
      </div>
    );
  }

  return <>{children}</>;
};