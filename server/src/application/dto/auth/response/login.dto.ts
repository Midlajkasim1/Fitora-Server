import { ApprovalStatus, UserRole } from "@/domain/constants/auth.constants";

// export interface LoginResponseDTO {
//   accessToken: string;
//   refreshToken: string;
//   userId: string; 
//   role: UserRole;
//   isOnboardingRequired: boolean;
//   approval_status?: ApprovalStatus; 
// }
export class LoginResponseDTO {
  accessToken!: string;
  refreshToken!: string;
  userId!: string;
  role!: UserRole;
  isOnboardingRequired!: boolean;
  approval_status?: ApprovalStatus;

  constructor(data: LoginResponseDTO) {
    Object.assign(this, data);
  }
}