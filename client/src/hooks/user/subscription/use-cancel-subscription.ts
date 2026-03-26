import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../../api/axios";
import toast from "react-hot-toast";

export const useCancelSubscription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { data } = await api.patch("/user/subscriptions/cancel");
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-premium-status"] });
      queryClient.invalidateQueries({ queryKey: ["purchase-history"] });
      queryClient.invalidateQueries({ queryKey: ["user-active-subscriptions"] });
      toast.success("Subscription cancelled successfully");
    }
  
  });
};