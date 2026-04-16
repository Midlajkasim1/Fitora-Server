import { z } from "zod";
export const trainerOnboardingSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  bio: z.string().min(10, "Bio is too short"),
  experience_year: z.coerce.number().min(0, "Experience cannot be negative"),
  gender: z.preprocess((val) => String(val).toLowerCase(), z.enum(["male", "female", "other"])),

  specializations: z.string().min(1, "Select a workout"),

  certifications: z.array(z.string()).optional().default([])
});