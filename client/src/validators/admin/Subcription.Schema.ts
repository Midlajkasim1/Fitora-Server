// validators/admin/Subcription.Schema.ts
import { z } from "zod";

export const createSubscriptionSchema = z.object({
  name: z.string().min(3, "Plan name must be at least 3 characters"),
  
  price: z.union([z.string(), z.number()])
    .transform((val) => val.toString())
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Price must be a positive number",
    }),

  billingCycle: z.enum(["1 month", "6 months", "1 yearly"]),

  description: z.string().min(10, "Description must be at least 10 characters"),
  
  sessionType: z.enum(["one_on_one", "group", "both", "none"]),
  
  sessionCredits: z.coerce.number().min(0, "Credits cannot be negative"),
  hasAiWorkout: z.boolean().default(false),
  hasAiDiet: z.boolean().default(false),
});

export type CreateSubscriptionFormData = z.infer<typeof createSubscriptionSchema>;