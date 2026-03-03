import { useQuery } from "@tanstack/react-query";
import api from "../../../api/axios";

export const useUserSpecializationById = (id: string) => {
  return useQuery({
    queryKey: ["user-workouts", id],
    queryFn: async () => {
      const res = await api.get(
        `/user/specializations/${id}`
      );
      return res.data.data;
    },
    enabled: !!id,
  });
};