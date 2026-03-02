import { useQuery } from "@tanstack/react-query";
import api from "../../api/axios";

export const useSpecializationById = (id: string) => {
  return useQuery({
    queryKey: ["specialization", id],
    queryFn: async () => {
      const res = await api.get(`/admin/specializations/${id}`);
      return res.data.data;
    },
    enabled: !!id,
  });
};