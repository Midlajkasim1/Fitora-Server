import { Navigate, Outlet } from "react-router-dom";
import { useSubscriptionStatus } from "../../hooks/user/subscription/check-plan-status";
import { GlobalLoader } from "../../shared/GlobalLoader";

export const SubscriptionGuard = () => {
  const { data, isLoading } = useSubscriptionStatus();

  if (isLoading) return <GlobalLoader />; 

  if (!data?.isPremium) {
    return <Navigate to="/subscription" replace />;
  }

  return <Outlet />;
};