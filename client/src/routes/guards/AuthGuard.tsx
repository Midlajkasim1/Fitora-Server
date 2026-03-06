import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../store/use-auth-store";

export const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, user, isInitialLoading } = useAuthStore();

  if (isInitialLoading) return null;

  if (!isAuthenticated || !user) {
    return <Navigate to="/" replace />;
  }

  const path = window.location.pathname;

  if (path.startsWith("/trainer") && user.role !== "trainer") {
    return <Navigate to="/home" replace />;
  }

  if (path === "/home" && user.role !== "user") {
    return <Navigate to="/trainer/dashboard" replace />;
  }

  if (user.role === "trainer") {
    const isApproved = user.approval_status === "approved";

    if (path.includes("/trainer/dashboard") && !isApproved) {
      return <Navigate to="/trainer/waiting-approval" replace />;
    }

  
    if (path.includes("/trainer/waiting-approval")) {
    
      return <>{children}</>;
    }
  }

  return <>{children}</>;
};