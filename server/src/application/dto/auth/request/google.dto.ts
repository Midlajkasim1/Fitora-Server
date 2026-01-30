import { UserRole } from "@/domain/constants/auth.constants";

export interface GoogleDTO {
  idToken:string
  role: UserRole
}