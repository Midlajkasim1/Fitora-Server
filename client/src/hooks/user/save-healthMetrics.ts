import { useMutation, useQueryClient } from "@tanstack/react-query";
import { saveHealthMetrics } from "../../api/user.api";
import toast from "react-hot-toast";

export const useSaveHealthMetrics = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: saveHealthMetrics,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-health-metrics"] });
      queryClient.invalidateQueries({ queryKey: ["premium-dashboard"] });
      
      toast.success("Health profile updated!");
    },

  });
};