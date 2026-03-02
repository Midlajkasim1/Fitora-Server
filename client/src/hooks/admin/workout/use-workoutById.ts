import { useQuery } from "@tanstack/react-query"
import api from "../../../api/axios"



export const useGetWorkoutById =(id:string)=>{
    return useQuery({
        queryKey:["admin-workout",id],
        queryFn:async ()=>{
            const res = await api.get(`/admin/workouts/${id}`);
            return res.data.data 
        },
        enabled: !!id
    })
}