import { useQuery } from "@tanstack/react-query";
import { getSpecializations } from "../../api/onboarding.apis";

export const useSpecializations = () => {
  return useQuery({
    queryKey: ["active-specializations"],
    queryFn: async () => {
      const res = await getSpecializations();
      return res.data?.data?.specialization;
    },
  });
};