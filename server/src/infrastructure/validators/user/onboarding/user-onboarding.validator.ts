import { z } from "zod";

export const userOnboardingSchema = z.object({
  userId: z.string().min(1),
  dob: z.coerce.date().max(new Date(), { message: "Date of birth cannot be in the future" })
    .min(new Date("1920-01-01"), { message: "Date of birth is too far in the past" }),
  gender: z.string(),
  primary_motives: z.array(z.string()),
  experience_level: z.string(),
  diet_preference: z.string(),
  preferred_workouts: z.string().min(1, "Select a workout"),
  sleep_hours: z.coerce.number(),
  medical_conditions: z.array(z.string()),
  water_intake: z.coerce.number().optional().default(2500)
});