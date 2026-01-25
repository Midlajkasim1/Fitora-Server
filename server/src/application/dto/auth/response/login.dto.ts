import { UserRole } from "@/domain/constants/auth.constants";

export interface LoginResponseDTO {
  accessToken: string;
  refreshToken: string;
  role: UserRole;
  isOnboardingRequired: boolean;
}
