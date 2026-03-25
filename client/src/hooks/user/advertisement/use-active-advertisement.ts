import { useQuery } from "@tanstack/react-query";
import { getActiveAdvertisement } from "../../../api/user.api";

export const useActiveAds = () => {
  return useQuery({
    queryKey: ["active-advertisement"],
    queryFn: getActiveAdvertisement,
    staleTime: 10 * 60 * 1000, 
  });
};