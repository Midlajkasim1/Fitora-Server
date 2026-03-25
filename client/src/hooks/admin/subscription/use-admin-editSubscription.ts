import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../../api/axios";
import toast from "react-hot-toast";
import type { CreateSubscriptionFormData } from "../../../validators/admin/Subcription.Schema";

export const useUpdateSubscriptionPlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: CreateSubscriptionFormData }) => {
      const res = await api.put(`/admin/subscriptions/${id}`, data);
      return res.data;
    },
    onSuccess: (res,variables) => {
      toast.success(res.message || "Plan updated successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-subscriptions"] });
      queryClient.invalidateQueries({ queryKey: ["subscription", variables.id] });
    },
  });
};