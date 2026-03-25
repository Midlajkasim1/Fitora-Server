import { useQuery } from "@tanstack/react-query";
import type { GetSubscriptionsResponse } from "../../../type/admin.types";
import api from "../../../api/axios";

export const useUserSubscriptions = (page:number=1) => {
  return useQuery<GetSubscriptionsResponse>({
    queryKey: ["user-active-subscriptions",page],
    queryFn: async () => {
      const res = await api.get("/user/subscriptions", {
        params: {page,limit:4, status: "active" } 
      });
      return res.data.data;
    },
  });
};