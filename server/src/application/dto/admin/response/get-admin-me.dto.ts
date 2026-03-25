import { AdminRole } from "@/domain/constants/auth.constants";

export class GetAdminMeResponseDTO {
  id!: string;
  email!: string;
  role!: AdminRole;

  constructor(data: GetAdminMeResponseDTO) {
    Object.assign(this, data);
  }
}