import { useQuery } from "@tanstack/react-query";
import { checkHealthMetrics } from "../../api/user.api";
export const useHealthMetrics = () => {
  return useQuery({
    queryKey: ["user-health-metrics"],
    queryFn: checkHealthMetrics,
    staleTime: 0,
    refetchOnWindowFocus: true 
  });
};

