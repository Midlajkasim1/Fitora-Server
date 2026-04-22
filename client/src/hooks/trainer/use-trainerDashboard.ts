import { useQuery } from "@tanstack/react-query"
import { trainerDashboard } from "../../api/trainer.api"



export const useTrainerDashboard = ()=>{
    return useQuery({
        queryKey:["trainerDashboard"],
        queryFn: trainerDashboard,
        staleTime: 0,
        refetchOnMount: "always",
        refetchOnWindowFocus: true
    })
}