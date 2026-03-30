import toast from "react-hot-toast";
import { bookSlot } from "../../../api/user.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useBookSlot = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: bookSlot,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["upcoming-sessions"] });
      queryClient.invalidateQueries({ queryKey: ["available-slots"] });
      toast.success(res.message);
    },
  });
};