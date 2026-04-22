import { useQuery } from "@tanstack/react-query";
import type { UpcomingSlotsParams, UpcomingSlotsResponse } from "../../type/trainer.types";
import { getTrainerUpcomingSlots } from "../../api/trainer.api";

export const useTrainerUpcomingSlots = (params: UpcomingSlotsParams) => {
  return useQuery<UpcomingSlotsResponse>({
    queryKey: ["trainer-upcoming-slots", params.page],
    queryFn: () => getTrainerUpcomingSlots(params),
    placeholderData: (prev) => prev,
    staleTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: true
  });
};