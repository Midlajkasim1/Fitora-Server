import { useQuery } from "@tanstack/react-query";
import { getAvailableSlots } from "../../../api/user.api";

export const useAvailableSlots = (page: number, limit: number, search?: string,trainerId?:string) => {
  return useQuery({
    queryKey: ["available-slots", page, limit, search,trainerId],
    queryFn: () => getAvailableSlots(page, limit, search,trainerId),
    placeholderData: (previousData) => previousData,
    refetchInterval:10000,
    refetchOnWindowFocus:true
  });
};