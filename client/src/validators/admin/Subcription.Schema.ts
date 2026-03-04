import { z } from "zod";

export const createSubscriptionSchema = z.object({
  name: z.string().min(3, "Plan name must be at least 3 characters"),
  
  price: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Price must be a valid  number",
  }),

  billingCycle: z.enum(["7 days", "1 month", "6 months", "Yearly", "Custom"]),

  description: z.string().min(10, "Description must be at least 10 characters"),
});

export type CreateSubscriptionFormData = z.infer<typeof createSubscriptionSchema>;