import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { fetchAiDiet, fetchAiWorkout, generateAiDiet, generateAiWorkout } from "../../../api/user.api";

// --- WORKOUT HOOKS ---
export const useWorkoutPlan = () => {
  return useQuery({
    queryKey: ["workout-plan"],
    queryFn: fetchAiWorkout,
    retry: false, 
  });
};

export const useGenerateWorkout = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: generateAiWorkout,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["workout-plan"] });
      toast.success(data.message || "Workout plan optimized!");
    },
  
  });
};

// --- DIET HOOKS ---
export const useDietPlan = () => {
  return useQuery({
    queryKey: ["diet-plan"],
    queryFn: fetchAiDiet,
    retry: false,
    meta:{
      disableToast:true
    }
  });
};

export const useGenerateDiet = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: generateAiDiet,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["diet-plan"] });
      toast.success(data.message || "Diet plan optimized!");
    },
  
  });
};