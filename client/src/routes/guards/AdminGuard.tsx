import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../../store/use-auth-store";

export const AdminGuard = () => {
  const { isAuthenticated, user, isInitialLoading } = useAuthStore();

  if (isInitialLoading) {
    return null;
  }

  if (!isAuthenticated || user?.role !== "admin") {
    return <Navigate to="/admin-portal" replace />;
  }

  return <Outlet />;
};