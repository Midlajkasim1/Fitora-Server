import { PlanSessionType } from "@/domain/constants/subscription.constants";
import { z } from "zod";

export const SubscriptionSchema = z.object({
  name: z
    .string()
    .min(2, "Plan name must be at least 2 characters")
    .max(50, "Plan name is too long"),
    
  price: z
    .string()
    .min(1, "Price is required")
    .refine((val) => !isNaN(Number(val)) || val.toLowerCase() === "custom", {
      message: "Price must be a number or 'Custom'",
    }),

  billingCycle: z
    .string()
    .min(1, "Please select a billing cycle"),

  description: z
    .string()
    .min(10, "Description should be at least 10 characters")
    .max(500, "Description is too long"),

sessionType: z.nativeEnum(PlanSessionType),
  sessionCredits: z.coerce.number().min(0, "Credits cannot be negative"),

  aiWorkoutLimit: z.coerce.number().int().describe("-1 for unlimited"),

  aiDietLimit: z.coerce.number().int().describe("-1 for unlimited"),
});

