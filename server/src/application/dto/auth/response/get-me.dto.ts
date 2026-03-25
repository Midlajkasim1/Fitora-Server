import { ApprovalStatus, UserRole, UserStatus } from "@/domain/constants/auth.constants";

// export interface GetMeResponseDTO {
//   id: string;
//   email: string;
//   firstName: string;
//   lastName: string;
//   role: UserRole;
//   status: UserStatus;
//   isOnboardingRequired: boolean;
//   profileImage?: string;
//   approval_status: ApprovalStatus
// }
export class GetMeResponseDTO {
  id!: string;
  email!: string;
  firstName!: string;
  lastName!: string;
  role!: UserRole;
  status!: UserStatus;
  isOnboardingRequired!: boolean;
  profileImage?: string;
  approval_status!: ApprovalStatus; 
  constructor(data: GetMeResponseDTO) {
    Object.assign(this, data);
  }
}