import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { EditWorkoutFormData } from "../../../validators/admin/EditWorkout.Schema";
import api from "../../../api/axios";
import toast from "react-hot-toast";


export const useUpdateWorkout =(id:string)=>{
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn:async (data:EditWorkoutFormData)=>{
            const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("specializationId", data.specializationId);
      formData.append("difficulty", data.difficulty);
      formData.append("duration", String(data.duration));
      formData.append("caloriesBurn", String(data.caloriesBurn));
      formData.append("bodyFocus", data.bodyFocus)    ;
      if(data.video){
        formData.append("video",data.video)
      } 
      if(data.thumbnail){
        formData.append("thumbnail",data.thumbnail);
      }
      const res = await api.put(
        `/admin/workouts/${id}`,
        formData,{
            headers:{
                "Content-Type":"multipart/form-data"
            }
        }
      );
      return res.data;
       },
       onSuccess:()=>{
           queryClient.invalidateQueries({
        queryKey: ["admin-workouts"],
      });
        queryClient.invalidateQueries({
       queryKey: ["admin-workout", id]
     });

      toast.success("Workout updated successfully ", {
        id: "update",
      });
    },

    onError: () => {
      toast.error("Failed to update workout ", {
        id: "update",
      });
       }
    })
}