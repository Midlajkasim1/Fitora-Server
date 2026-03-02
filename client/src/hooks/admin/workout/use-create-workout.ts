import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { CreateWorkoutFormData } from "../../../validators/admin/workout.Schema";
import api from "../../../api/axios";
import toast from "react-hot-toast";



export const useCreateWorkout =()=>{
    const queryClient = useQueryClient();
    return useMutation({
   mutationFn: async (data:CreateWorkoutFormData)=>{
    const formData = new FormData();

    formData.append("title",data.title);
    formData.append("description",data.description);
    formData.append("specializationId",data.specializationId);
    formData.append("difficulty",data.difficulty);
    formData.append("duration",String(data.duration));
    formData.append("caloriesBurn",String(data.caloriesBurn));
    formData.append("bodyFocus",data.bodyFocus);
    formData.append("video",data.video);
    formData.append("thumbnail",data.thumbnail);
    
    const res = await api.post(
        "/admin/workouts",
        formData,
        {
            headers:{
            "Content-Type":"multipart/form-data",
        },
    }
    );
    return res.data;

   },
  onSuccess: () => {
  queryClient.invalidateQueries({
    queryKey: ["admin-workouts"],
  });

  toast.success("Workout published successfully ", {
    id: "publish",  
  });
},
onError: () => {
  toast.error("Failed to publish workout ", {
    id: "publish",
  });
}
        
    });
}