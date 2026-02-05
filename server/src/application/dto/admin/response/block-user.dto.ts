import { UserStatus } from "@/domain/constants/auth.constants";

export interface BlockUserResponseDTO {
  id: string;
  email: string;
  status: UserStatus;
  message: string;
}