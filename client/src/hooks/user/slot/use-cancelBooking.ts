import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cancelBooking } from "../../../api/user.api";
import toast from "react-hot-toast";

export const useCancelBooking = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: cancelBooking,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["upcoming-sessions"] });
      toast.success(res.message);
    },
  });
};