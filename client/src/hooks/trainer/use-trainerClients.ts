import { useQuery } from "@tanstack/react-query";
import { getTrainerClients } from "../../api/trainer.api";
import type { TrainerClientsparams, TrainerClientsResponse } from "../../type/trainer.types";

export const useTrainerClients = (params: TrainerClientsparams) => {
  return useQuery<TrainerClientsResponse>({
    queryKey: ["trainer-clients", params.type, params.page, params.search],
    queryFn: () => getTrainerClients(params),
    placeholderData: (previousData) => previousData, 
  });
};