import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getTrainerWallet, requestPayout } from "../../api/trainer.api";
import toast from "react-hot-toast";

export const useTrainerWallet = (page: number = 1, limit: number = 10) => {
  return useQuery({
    queryKey: ["trainerWallet", page, limit],
    queryFn: () => getTrainerWallet(page, limit),
  });
};

export const useRequestPayout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (amount: number) => requestPayout(amount),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trainerWallet"] });
      toast.success("Payout request submitted successfully");
    },
  });
};
