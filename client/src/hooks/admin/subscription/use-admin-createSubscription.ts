import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateSubscriptionRequest } from "../../../type/admin.types";
import api from "../../../api/axios";

export const useCreateSubscriptionPlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateSubscriptionRequest) => {
      const res = await api.post("/admin/subscriptions", data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-subscriptions"] });
    },
  });
};