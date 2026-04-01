import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { createTrainerSlot } from "../../../api/trainer.api";

export const useCreateSlot = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createTrainerSlot,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trainer-upcoming-slots"] });
      queryClient.invalidateQueries({ queryKey: ["available-slots"] });
      toast.success("Slot created successfully")
    },
  });
}