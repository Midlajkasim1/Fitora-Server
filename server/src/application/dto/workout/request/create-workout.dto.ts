import { WorkoutDifficulty } from "@/domain/constants/workout.constant";


export interface CreateWorkoutRequestDTO{
  title: string;
  description: string;
  specializationId: string;
  duration: number;
  caloriesBurn: number;
  bodyFocus: string;
  difficulty: WorkoutDifficulty;
}