import { useMutation } from "@tanstack/react-query";
import api from "../../../api/axios";

export const usePurchasePlan = () => {
  return useMutation({
    mutationFn: async (planId: string) => {
      const { data } = await api.post("/user/purchase", { planId });
      return data.data; 
    },
    onSuccess: (data) => {
      window.location.href = data.checkoutUrl;
    },
    onError: (error) => {
      const err = error as { response?: { data?: { message?: string } } };
      console.error("Purchase failed:", err.response?.data?.message || "Server Error");
    }
  });
};