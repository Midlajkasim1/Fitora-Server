import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../store/use-auth-store";

export const OnboardingGuard = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) return <Navigate to="/register" replace />;
  
  if (!user?.isOnboardingRequired) {
    return <Navigate to={user?.role === "trainer" ? "/trainer/dashboard" : "/home"} replace />;
  }

  return <>{children}</>;
};