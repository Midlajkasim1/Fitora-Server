import { z } from "zod";

export const userOnboardingSchema = z.object({
  userId: z.string().min(1),
  dob: z.preprocess((arg) => {
    if (typeof arg == "string" || arg instanceof Date) return new Date(arg);
  }, z.date()),
  gender: z.string(),
  primary_motives: z.array(z.string()),
  experience_level: z.string(),
  diet_preference: z.string(),
  preferred_workouts: z.array(z.string()),
  sleep_hours: z.coerce.number(),
  medical_conditions: z.array(z.string()),
  water_intake: z.coerce.number().optional().default(2500) // Match your schema
});