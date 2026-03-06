import { useEffect } from "react";
import { getAdminMe } from "../api/admin.api";
import { getMe } from "../api/auth.api";
import { useAuthStore } from "../store/use-auth-store";
import { GlobalLoader } from "../shared/GlobalLoader";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { setAuth, logout, setInitialLoading, isInitialLoading } = useAuthStore();

  useEffect(() => {
    const syncAuth = async () => {
      const currentPath = window.location.pathname;
      try {
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
    return <GlobalLoader/>
     
  }

  return <>{children}</>;
};