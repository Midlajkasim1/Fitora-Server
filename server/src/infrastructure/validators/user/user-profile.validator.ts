import { z } from "zod";

export const updateUserProfileSchema = z.object({
  firstName: z
    .string()
    .min(2, "First name is too short")
    .max(50)
    .refine(val => !/^[_ \-\s]+$/.test(val), "First name cannot consist of only underscores, spaces, or hyphens")
    .refine(val => /[a-zA-Z]/.test(val), "First name must contain letters")
    .optional(),
  lastName: z
    .string()
    .min(2, "Last name is too short")
    .max(50)
    .refine(val => !/^[_ \-\s]+$/.test(val), "Last name cannot consist of only underscores, spaces, or hyphens")
    .refine(val => /[a-zA-Z]/.test(val), "Last name must contain letters")
    .optional(),
  phone: z
    .string()
    .regex(/^\d{10}$/, "Phone must be exactly 10 digits")
    .refine((val) => {
      const allSame = /^(.)\1+$/.test(val);
      return !allSame;
    }, {
      message: "Please enter a valid phone number, not repeating digits"
    })
    .optional(),
  preferredWorkouts: z.string().min(1, "Select a workout").optional(),
  experienceLevel: z.string().optional(),
});