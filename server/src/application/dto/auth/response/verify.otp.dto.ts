import { UserRole } from "@/domain/constants/auth.constants";

// export interface VerifyOtpResponseDTO {
// message: string;
//   accessToken: string;
//   refreshToken: string;
//   user: {
//     id:string;
//     email: string;
//     role: UserRole;
//     isOnboardingRequired: boolean;
//   }
// }
export class VerifyOtpResponseDTO {
  message!: string;
  accessToken!: string;
  refreshToken!: string;
  user!: {
    id: string;
    email: string;
    role: UserRole;
    isOnboardingRequired: boolean;
  };

  constructor(data: VerifyOtpResponseDTO) {
    Object.assign(this, data);
  }
}