import { useQuery } from "@tanstack/react-query";
import { getPremiumDashboard } from "../../api/user.api";

export const usePremiumDashboard = () => {
  return useQuery({
    queryKey: ["premium-dashboard"],
    queryFn: getPremiumDashboard,
  });
};