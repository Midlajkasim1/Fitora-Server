import { useQuery } from "@tanstack/react-query";
import { fetchUpcomingSessions } from "../../../api/user.api";


export const useUpcomingSessions = (page: number, limit: number) => {
  return useQuery({
    queryKey: ["upcoming-sessions", page],
    queryFn: () => fetchUpcomingSessions(page, limit),
  });
};