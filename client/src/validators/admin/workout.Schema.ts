
import { z } from "zod";

export const createWorkoutSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  specializationId: z.string().min(1, "Specialization required"),
  difficulty: z.enum(["beginner", "intermediate", "advanced"]),
  duration: z.coerce.number().refine(
    (val) => [5, 10, 15].includes(val),
    "Duration must be 5, 10 or 15 minutes"
  ),
  caloriesBurn: z.coerce.number().min(1, "Calories required"),
  bodyFocus: z.string().min(2, "Body focus required"),

  video: z.instanceof(File).optional().or(z.any()), 
  thumbnail: z.instanceof(File).optional().or(z.any()),
});

export type CreateWorkoutFormData =
  z.infer<typeof createWorkoutSchema>;