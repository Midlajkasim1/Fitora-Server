import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toggleWorkoutStatus } from "../../../api/admin.api";
import type { GetAllWorkoutResponse } from "../../../type/admin.types";



export const useWorkoutToggleStatus = ()=>{
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn:(id:string)=>toggleWorkoutStatus(id),
        onSuccess:(_,workoutId)=>{
            queryClient.setQueriesData<GetAllWorkoutResponse>(
                {queryKey:["admin-workouts"]},
                (oldData)=>{
                    if(!oldData)return oldData;
                    return {
                        ...oldData,
                        workouts:oldData.workouts.map((w)=>
                        w.id === workoutId
                        ?{
                            ...w,
                            status:w.status === "active" ? "blocked" : "active",
                        }
                        :w
                    )
                    }
                }
            )
        }
    })
}