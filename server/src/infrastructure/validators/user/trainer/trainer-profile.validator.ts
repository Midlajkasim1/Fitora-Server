import { z } from "zod";

export const updateTrainerProfileSchema = z.object({
    firstName: z
        .string()
        .min(2, "First name must be at least 2 characters")
        .max(50)
        .optional(),
    lastName: z
        .string()
        .min(2, "Last name must be at least 2 characters")
        .max(50)
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
        .optional()
    ,
    experience_year: z
        .preprocess((val) => Number(val), z.number().min(0, "Experience cannot be negative").max(60, "maximum experience is 50"))
        .optional(),
});

// This helps TypeScript know the shape of the validated data
export type UpdateTrainerProfileInput = z.infer<typeof updateTrainerProfileSchema>;