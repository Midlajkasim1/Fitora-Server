import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../store/use-auth-store";

export const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, user, isInitialLoading } = useAuthStore();

  if (isInitialLoading) {
    return <div className="min-h-screen bg-[#0a1810]" />;
  }


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
    if (!isApproved && path.includes("/trainer/dashboard")) {
      return <Navigate to="/trainer/waiting-approval" replace />;
    }
    if (isApproved && path.includes("/trainer/waiting-approval")) {
      return <Navigate to="/trainer/dashboard" replace />;
    }
  }

  return <>{children}</>;
};