import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import type { CreateSubscriptionRequest } from "../../../type/admin.types";
import api from "../../../api/axios";

export const useCreateSubscription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateSubscriptionRequest) => {
      const res = await api.post("/admin/subscriptions", data);
      return res.data;
    },
    onSuccess: (res) => {
      toast.success(res.message || "Subscription plan created");
      queryClient.invalidateQueries({ queryKey: ["admin-subscriptions"] });
    },
  });
};