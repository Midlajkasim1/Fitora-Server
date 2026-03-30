import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { editTrainerSlot } from "../../../api/trainer.api";

export const useEditSlot = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: editTrainerSlot,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trainer-upcoming-slots"] });
      toast.success( "Slot updated successfully!");
    }
  
  });
};