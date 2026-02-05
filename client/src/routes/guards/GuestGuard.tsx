import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../store/use-auth-store";

export const GuestGuard = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, user, isInitialLoading } = useAuthStore();

  if (isInitialLoading) return null;

  if (isAuthenticated && user) {
    if (user.isOnboardingRequired) {
      const rolePath = user.role === "trainer" ? "trainer" : "user";
      return <Navigate to={`/onboarding/${rolePath}/step-1`} replace />;
    }

    if (user.role === "trainer") {
      if (user.approval_status === "pending" || user.approval_status === "rejected") {
        return <Navigate to="/trainer/waiting-approval" replace />;
      }
      return <Navigate to="/trainer/dashboard" replace />;
    }

    if (user.role === "admin") {
      return <Navigate to="/admin/dashboard" replace />;
    }

    return <Navigate to="/home" replace />;
  }

  return <>{children}</>;
};