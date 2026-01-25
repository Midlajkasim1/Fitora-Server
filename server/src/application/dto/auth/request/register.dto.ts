import { UserRole, UserStatus } from "@/domain/constants/auth.constants";

export interface RegisterDTO {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: UserRole
}
