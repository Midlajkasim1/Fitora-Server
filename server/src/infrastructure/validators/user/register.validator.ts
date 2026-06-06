import { z } from "zod";
import { UserRole } from "@/domain/constants/auth.constants";

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  confirmPassword: z.string().min(6), 
  firstName: z.string()
    .min(2, "First name is too short")
    .refine(val => !/^[_ \-\s]+$/.test(val), "First name cannot consist of only underscores, spaces, or hyphens")
    .refine(val => /[a-zA-Z]/.test(val), "First name must contain letters"),
  lastName: z.string()
    .min(2, "Last name is too short")
    .refine(val => !/^[_ \-\s]+$/.test(val), "Last name cannot consist of only underscores, spaces, or hyphens")
    .refine(val => /[a-zA-Z]/.test(val), "Last name must contain letters"),
  phone: z.string()
    .regex(/^[0-9]{10}$/, "Phone number must be exactly 10 digits")
    .refine((val) => !/^(.)\1+$/.test(val), "Phone number cannot consist of the same repeating digit"),
  role: z.nativeEnum(UserRole),
})
.refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
})
.transform(({ email, password, firstName, lastName, phone, role }) => ({
  email,
  password,
  firstName,
  lastName,
  phone,
  role,
}));