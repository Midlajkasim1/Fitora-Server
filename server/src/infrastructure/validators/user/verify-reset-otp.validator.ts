import { z } from "zod";

export const verifyResetOtpSchema = z.object({
  email: z.string().email("Invalid email format"),
  otp: z.string().length(6, "OTP must be 6 digits"),
});
