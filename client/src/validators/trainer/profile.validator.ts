import { z } from "zod";

export const trainerProfileSchema = z.object({
  firstName: z.string()
    .min(2, "First name is too short")
    .max(50)
    .refine(val => !/^[_ \-\s]+$/.test(val), "First name cannot consist of only underscores, spaces, or hyphens")
    .refine(val => /[a-zA-Z]/.test(val), "First name must contain letters"),
  lastName: z.string()
    .min(2, "Last name is too short")
    .max(50)
    .refine(val => !/^[_ \-\s]+$/.test(val), "Last name cannot consist of only underscores, spaces, or hyphens")
    .refine(val => /[a-zA-Z]/.test(val), "Last name must contain letters"),
  phone: z.string().regex(/^\d{10}$/, "Phone must be exactly 10 digits")
    .refine((val) => !/^(.)\1+$/.test(val), "Invalid phone number"),
  experience_year: z.preprocess(
    (val) => Number(val), 
    z.number().min(0, "Cannot be negative").max(50, "Experience limit exceeded")
  ),
});

export type TrainerProfileFormData = z.infer<typeof trainerProfileSchema>;