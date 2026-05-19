import { UserStatus } from "@/domain/constants/auth.constants";

export class UserManagementDTO {
  id!: string;
  email!: string;
  firstName!: string;
  lastName!: string;
  profileImage?: string;
  status!: UserStatus;
  createdAt!: Date;

  constructor(data: UserManagementDTO) {
    Object.assign(this, data);
  }
}