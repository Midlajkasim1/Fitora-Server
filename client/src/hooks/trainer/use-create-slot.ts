import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTrainerSlot } from "../../api/trainer.api";

export const useCreateSlot = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createTrainerSlot,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trainer-upcoming-slots"] });
    },
  });
}