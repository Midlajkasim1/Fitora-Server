import { UserStatus } from "@/domain/constants/auth.constants";

export class TrainerManagementDTO {
  id!: string;
  email!: string;
  firstName!: string;
  lastName!: string;
  profileImage?: string;
  status!: UserStatus;
  createdAt!: Date;

  constructor(data: TrainerManagementDTO) {
    Object.assign(this, data);
  }
}