import { UserRole } from "@/domain/constants/auth.constants";

export interface VerifyOtpResponseDTO {
message: string;
  accessToken: string;
  refreshToken: string;
  user: {
    email: string;
    role: UserRole;
    isOnboardingRequired: boolean;
  }
}
