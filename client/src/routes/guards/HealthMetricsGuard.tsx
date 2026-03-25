import { Navigate, Outlet } from "react-router-dom";
import { useHealthMetrics } from "../../hooks/user/use-healthMetrics";
import { GlobalLoader } from "../../shared/GlobalLoader";

export const HealthMetricsGuard = () => {
  const { data: response, isLoading } = useHealthMetrics();

  if (isLoading) return <GlobalLoader />;

  const hasCompletedMetrics = response?.exists === true;

  if (!hasCompletedMetrics) {
    console.warn("No Health Metrics record found. Redirecting...");
    return <Navigate to="/health-metrics" replace />;
  }

  return <Outlet />;
};