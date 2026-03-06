import { useQuery } from "@tanstack/react-query";
import api from "../../../api/axios";
import { useAuthStore } from "../../../store/use-auth-store";

export const useSubscriptionStatus = () => {
  const { user } = useAuthStore(); 

  return useQuery({
    queryKey: ["user-premium-status", user?.id], 
    queryFn: async () => {
      const res = await api.get("/user/active-user-plan");
      return res.data.data; 
    },
    enabled: !!user?.id, 
  });
};