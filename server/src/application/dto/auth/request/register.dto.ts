import { UserRole } from "@/domain/constants/auth.constants";

// export interface RegisterDTO {
//   email: string;
//   password: string;
//   firstName: string;
//   lastName: string;
//   phone: string;
//   role: UserRole
// }
export class RegisterDTO {
  email!: string;
  password!: string;
  firstName!: string;
  lastName!: string;
  phone!: string;
  role!: UserRole;

  constructor(data: RegisterDTO) {
    Object.assign(this, data);
  }
}