import { UserRole } from "@/domain/constants/auth.constants";

export interface GoogleLoginResponseDTO {
  accessToken: string;
  refreshToken: string;
  role: UserRole;
  isOnboardingRequired: boolean;
}
