import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../../store/use-auth-store";

export const AdminGuard = () => {
  const { isAuthenticated, user, isInitialLoading } = useAuthStore();

  if (isInitialLoading) {
    return (
      <div className="h-screen w-full bg-[#0a1810] flex items-center justify-center text-[#00ff94] font-black italic tracking-widest animate-pulse">
        LOADING...
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== "admin") {
    return <Navigate to="/admin-portal" replace />;
  }

  return <Outlet />;
};