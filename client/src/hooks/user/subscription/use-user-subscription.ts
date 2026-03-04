import { useQuery } from "@tanstack/react-query";
import type { GetSubscriptionsResponse } from "../../../type/admin.types";
import api from "../../../api/axios";

export const useUserSubscriptions = () => {
  return useQuery<GetSubscriptionsResponse>({
    queryKey: ["user-active-subscriptions"],
    queryFn: async () => {
      const res = await api.get("/user/subscriptions", {
        params: { status: "active" } 
      });
      return res.data.data;
    },
  });
};