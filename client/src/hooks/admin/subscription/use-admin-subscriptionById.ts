import { useQuery } from "@tanstack/react-query";
import api from "../../../api/axios";

export const useSubscriptionPlanById = (id: string) => {
  return useQuery({
    queryKey: ["subscription", id],
    queryFn: async () => {
      const res = await api.get(`/admin/subscriptions/${id}`);
      return res.data.data;
    },
    enabled: !!id,
  });
};