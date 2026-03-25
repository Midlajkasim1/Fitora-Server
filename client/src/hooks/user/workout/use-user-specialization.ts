import { useQuery } from "@tanstack/react-query";
import api from "../../../api/axios";

export const useUserSpecializations = (page: number = 1) => {
  return useQuery({
    queryKey: ["user-specialization", page], 
    queryFn: async () => {
      const res = await api.get("/user/specializations", {
        params: { page, limit: 6 } 
      });
      return res.data.data;
    },
  });
};