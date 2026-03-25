import { UserRole } from "@/domain/constants/auth.constants";

export class OtpSessionDTO {
  email!: string;
  otp!: string;
  password!: string; 
  firstName!: string;
  lastName!: string;
  phone!: string;
  role!: UserRole;

  constructor(data: OtpSessionDTO) {
    Object.assign(this, data);
  }
}