import { z } from "zod";

export const healthMetricsSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  height: z.coerce.number()
    .min(50, "Height must be at least 50 cm")
    .max(300, "Height must be under 300 cm"),
  weight: z.coerce.number()
    .min(20, "Weight must be at least 20 kg")
    .max(500, "Weight must be under 500 kg"),
  targetWeight: z.coerce.number()
    .min(20, "Target weight must be at least 20 kg")
    .max(500, "Target weight must be under 500 kg"),
  primaryGoal: z.string().min(1, "Primary goal is required")
});