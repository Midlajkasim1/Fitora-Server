import { z } from "zod";

export const healthMetricsSchema = z.object({
  height: z.coerce
    .number()
    .min(50, "Height must be at least 50 cm")
    .max(300, "Height must be under 300 cm"),
    
  weight: z.coerce
    .number()
    .min(20, "Weight must be at least 20 kg")
    .max(500, "Weight must be under 500 kg"),
    
  targetWeight: z.coerce
    .number()
    .min(20, "Target weight must be at least 20 kg")
    .max(500, "Target weight must be under 500 kg"),
    
   primaryGoal: z.enum(["Weight Loss", "Muscle Gain", "Endurance", "General Fitness"], {
    invalid_type_error: "Please select a valid goal",
  }),
});

export type HealthMetricsFormData = z.infer<typeof healthMetricsSchema>;