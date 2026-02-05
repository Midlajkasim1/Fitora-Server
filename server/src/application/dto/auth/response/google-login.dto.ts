import { UserRole } from "@/domain/constants/auth.constants";
import { ApprovalStatus } from "@/domain/enum/user/trainer-details.enum";

export interface GoogleLoginResponseDTO {
  accessToken: string;
  refreshToken: string;
  role: UserRole;
  isOnboardingRequired: boolean;
  user: {             
    id: string;
    email: string;
    role: string;
    isOnboardingRequired: boolean;
    approval_status?: ApprovalStatus;
  }
}
