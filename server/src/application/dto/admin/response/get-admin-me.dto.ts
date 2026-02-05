import { AdminRole } from "@/domain/constants/auth.constants";

export interface GetAdminMeResponseDTO {
  id: string;
  email: string;
  role: AdminRole;
}