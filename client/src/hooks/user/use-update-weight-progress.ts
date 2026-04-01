import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateWeeklyWeight } from "../../api/user.api";
import toast from "react-hot-toast";

export const useUpdateWeight = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateWeeklyWeight,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["premium-dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["user-health-metrics"] });
      
      toast.success("Progress tracked! See you next week.");
    },

  });
};