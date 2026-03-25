import { useQuery } from "@tanstack/react-query";
import { getAdvertisementById } from "../../../api/admin.api";

export const useAdvertisementById = (id: string) => {
  return useQuery({
    queryKey: ["admin-advertisement", id],
    queryFn: () => getAdvertisementById(id),
    enabled: !!id, 
    staleTime: 5 * 60 * 1000, 
  });
};