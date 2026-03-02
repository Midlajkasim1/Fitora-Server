
import { z } from "zod";
import { WorkoutDifficulty } from "@/domain/constants/workout.constant";

export const UpdateWorkoutSchema = z.object({
  id: z.string().min(1, "Workout id is required"),
  title: z.string().min(2).optional(),
  description: z.string().min(10).optional(),
  specializationId: z.string().optional(),
  duration: z.coerce.number().optional(),
  caloriesBurn: z.coerce.number().optional(),
  bodyFocus: z.string().optional(),
  difficulty: z.nativeEnum(WorkoutDifficulty).optional(),
});

