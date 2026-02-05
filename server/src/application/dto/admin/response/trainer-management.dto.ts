import { UserStatus } from "@/domain/constants/auth.constants";

export interface TrainerManagementDTO {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  profileImage?: string;
  status: UserStatus;
  createdAt: Date;
}