import { z } from "zod";
import { UserRole } from "@/domain/constants/auth.constants";

export const googleLoginSchema = z.object({
  idToken: z.string().min(10, "Invalid Google token"),
  role: z.nativeEnum(UserRole),
});
