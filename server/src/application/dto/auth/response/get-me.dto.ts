import { UserRole, UserStatus } from "@/domain/constants/auth.constants";
import { ApprovalStatus } from "@/domain/enum/user/trainer-details.enum";

export interface GetMeResponseDTO {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  status: UserStatus;
  isOnboardingRequired: boolean;
  profileImage?: string;
  approval_status: ApprovalStatus
}