import { UserRole } from "@/domain/constants/auth.constants";

export interface OtpSessionDTO {
  email: string;
  otp: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: UserRole;
}
