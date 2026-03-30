import { useQuery } from "@tanstack/react-query";
import { getAvailableSlots } from "../../../api/user.api";

export const useAvailableSlots = () => {
  return useQuery({
    queryKey: ["available-slots"],
    queryFn: getAvailableSlots,
  });
};