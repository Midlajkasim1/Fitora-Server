import { useQuery } from "@tanstack/react-query";
import type { StartWorkout } from "../../../type/user.types";
import api from "../../../api/axios";



export const useStartWorkout =(params:StartWorkout,enabled:boolean)=>{
    return useQuery({
        queryKey:["workout-session",params],
        queryFn:async()=>{
            const res = await api.get(`/user/specializations/${params.id}/start`,{
              params:{
                difficulty:params.difficulty,
                duration:params.duration
              }  
            });
            return res.data.data;
        },
        enabled:enabled,
    })
}