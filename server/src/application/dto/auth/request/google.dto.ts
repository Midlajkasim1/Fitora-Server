import { UserRole } from "@/domain/constants/auth.constants";

// export interface GoogleDTO {
//   idToken:string
//   role: UserRole
// }

export class GoogleDTO {
  idToken!: string;
  role!: UserRole;

  constructor(data: GoogleDTO) {
    Object.assign(this, data);
  }
}