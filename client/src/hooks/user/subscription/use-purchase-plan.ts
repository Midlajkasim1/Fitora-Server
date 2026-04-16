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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      console.error("Purchase failed:", error.response?.data?.message || "Server Error");
    }
  });
};