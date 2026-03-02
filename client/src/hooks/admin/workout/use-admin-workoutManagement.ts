import { useQuery } from "@tanstack/react-query";
import type { GetAllWorkoutResponse, WorkoutQuery } from "../../../type/admin.types";
import { getAllWorkouts } from "../../../api/admin.api";




export const useWorkoutManagement = (params:WorkoutQuery)=>{
    return useQuery<GetAllWorkoutResponse>({
        queryKey:["admin-workouts",params],
        queryFn:async()=>{
            const res = await getAllWorkouts(params);
            return res.data.data;
        },
        placeholderData:(prev)=>prev 
    })
}