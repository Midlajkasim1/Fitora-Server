import { UserStatus } from "@/domain/constants/auth.constants";

export interface BlockTrainerResponseDTO {
  id: string;
  email: string;
  status: UserStatus;
  message: string;
}