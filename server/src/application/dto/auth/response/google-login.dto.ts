import { ApprovalStatus, UserRole } from "@/domain/constants/auth.constants";

// export interface GoogleLoginResponseDTO {
//   accessToken: string;
//   refreshToken: string;
//   role: UserRole;
//   isOnboardingRequired: boolean;
//   user: {             
//     id: string;
//     email: string;
//     role: string;
//     isOnboardingRequired: boolean;
//     approval_status?: ApprovalStatus;
//   }
// }
export class GoogleLoginResponseDTO {
  accessToken!: string;
  refreshToken!: string;
  role!: UserRole;
  isOnboardingRequired!: boolean;
  user!: {
    id: string;
    email: string;
    role: string;
    isOnboardingRequired: boolean;
    approval_status?: ApprovalStatus;
  };

  constructor(data: GoogleLoginResponseDTO) {
    Object.assign(this, data);
  }
}