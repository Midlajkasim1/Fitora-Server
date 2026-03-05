import { z } from "zod";


export const createSubscriptionSchema = z.object({
  name: z.string().min(3, "Plan name must be at least 3 characters"),
  price: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Price must be a valid number",
  }),
  billingCycle: z.enum(["7 days", "1 month", "6 months", "Yearly"]),
  description: z.string().min(10, "Description must be at least 10 characters"),
  
  sessionType: z.enum(["one_on_one", "group", "both", "none"]),
  
  sessionCredits: z.coerce.number().min(0, "Credits cannot be negative"),
  aiWorkoutLimit: z.coerce.number().min(-1, "Use -1 for unlimited"),
  aiDietLimit: z.coerce.number().min(-1, "Use -1 for unlimited"),
});

export type CreateSubscriptionFormData = z.infer<typeof createSubscriptionSchema>;