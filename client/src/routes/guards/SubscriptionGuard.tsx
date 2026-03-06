import { Navigate, Outlet } from "react-router-dom";
import { useSubscriptionStatus } from "../../hooks/user/subscription/check-plan-status";

export const SubscriptionGuard = () => {
  const { data, isLoading } = useSubscriptionStatus();

  if (isLoading) return null; 

  if (!data?.isPremium) {
    return <Navigate to="/subscription" replace />;
  }

  return <Outlet />;
};