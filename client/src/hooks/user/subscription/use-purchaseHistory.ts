import { useQuery } from "@tanstack/react-query";
import type { PurchaseHistoryResponse } from "../../../type/user.types";
import api from "../../../api/axios";



export const usePurchaseHistory = (page: number = 1, limit: number = 10) => {
  return useQuery<PurchaseHistoryResponse>({
    queryKey: ["purchase-history", page],
    queryFn: async () => {
      const res = await api.get("/user/subscriptions-history", {
        params: { page, limit }
      });
      return res.data.data;
    },
  });
};