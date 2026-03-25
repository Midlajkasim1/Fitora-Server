import { useQuery } from "@tanstack/react-query";
import api from "../../api/axios";
export const useHealthMetrics = () => {
  return useQuery({
    queryKey: ["user-health-metrics"],
    queryFn: async () => {
      const res = await api.get("/user/health-metrics/check");
      return res.data.data;
    },
    // Set this to 0 so it always checks the freshest data during navigation
    staleTime: 0,
    // Ensure it refetches when the window gains focus
    refetchOnWindowFocus: true 
  });
};