import { UserRole } from "@/domain/constants/auth.constants";
import { ApprovalStatus } from "@/domain/enum/user/trainer-details.enum";

export interface LoginResponseDTO {
  accessToken: string;
  refreshToken: string;
  userId: string; 
  role: UserRole;
  isOnboardingRequired: boolean;
  approval_status?: ApprovalStatus; 
}
