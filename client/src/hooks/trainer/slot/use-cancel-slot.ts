import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cancelTrainerSlot } from "../../../api/trainer.api";
import toast from "react-hot-toast";

export const useCancelSlot = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cancelTrainerSlot,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trainer-upcoming-slots"] });
      toast.success("Session cancelled successfully");
    },
  
  });
};