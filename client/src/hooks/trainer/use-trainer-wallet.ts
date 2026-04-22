import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getTrainerWallet, requestPayout } from "../../api/trainer.api";
import { useNotify } from "../common/use-notify";

export const useTrainerWallet = () => {
  return useQuery({
    queryKey: ["trainerWallet"],
    queryFn: getTrainerWallet,
  });
};

export const useRequestPayout = () => {
  const queryClient = useQueryClient();
  const { notify } = useNotify();

  return useMutation({
    mutationFn: (amount: number) => requestPayout(amount),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trainerWallet"] });
      notify("Payout request submitted successfully", "success");
    },
    onError: (error: any) => {
      notify(error.response?.data?.message || "Failed to submit payout request", "error");
    },
  });
};
