import { z } from "zod";

export const editWorkoutSchema = z.object({
  title: z.string().min(3,"Title must be at least 3 characters"),

  description: z.string().min(10,"Description must be at least 10 characters"),

  specializationId: z.string().min(1,"Specialization is required"),

  difficulty: z.enum(["beginner", "intermediate", "advanced"]),

  duration: z.coerce.number().refine(
    (val) => [5, 10, 15].includes(val),
    "Duration must be 5, 10 or 15 minutes"
  ),

  caloriesBurn: z.coerce.number().min(1,"Duration is required"),

  bodyFocus: z.string().min(2,"Body focus is required"),

  video: z.instanceof(File).optional(),

  thumbnail: z.instanceof(File).optional(),
});

export type EditWorkoutFormData =
  z.infer<typeof editWorkoutSchema>;