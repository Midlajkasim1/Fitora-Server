import { useQuery } from "@tanstack/react-query";
import type { GetTrainersResponse, TrainerQuery } from "../../type/admin.types";
import api from "../../api/axios";

export const useTrainerManagmenet = (params: TrainerQuery) => {
  return useQuery<GetTrainersResponse>({
    queryKey: ["admin-trainer", params],
    queryFn: async () => {
      const res = await api.get("/admin/trainers", {
        params: {
          page: params.page,
          limit: 10,
          search: params.search,
          status: params.status,
          specialization: params.specialization
        }
      });

      return res.data.data;
    },
    placeholderData: (prev) => prev
  });
};