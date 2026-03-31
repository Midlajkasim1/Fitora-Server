import { useQuery } from "@tanstack/react-query";
import { getBookingTrainers } from "../../../api/user.api";

export const useBookingTrainers = (page: number, limit: number, search?: string) => {
  return useQuery({
    queryKey: ["booking-trainers", page, limit, search],
    queryFn: () => getBookingTrainers(page, limit, search),
    placeholderData: (prev) => prev,
  });
};