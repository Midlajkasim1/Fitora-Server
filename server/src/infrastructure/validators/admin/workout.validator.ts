
import { z } from "zod";
import { WorkoutDifficulty } from "@/domain/constants/workout.constant";

export const CreateWorkoutSchema = z.object({
  title: z.string().min(2, "Title is required"),
  description: z.string().min(10, "Description too short"),
  specializationId: z.string().min(1, "Specialization is required"),

  duration: z.coerce.number().min(1, "Duration must be positive"),
  caloriesBurn: z.coerce.number().min(1, "Calories must be positive"),

  bodyFocus: z.string().min(2, "Body focus is required"),

  difficulty: z.nativeEnum(WorkoutDifficulty),
});
