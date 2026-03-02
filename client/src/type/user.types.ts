import type { UserRole } from "./auth.types";

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  gender?: string;
  status: "active" | "blocked";
  role?:UserRole;
  preferredWorkouts: string[];
  experienceLevel: string;
  profileImage?: string | null;

}

export interface UserProfileResponse {
  success: boolean;
  data: UserProfile;
}
export interface EditProfile {
  firstName?: string;
  lastName?: string;
  phone?: string;
  preferredWorkouts?: string[];
  experienceLevel?: string;
}

export interface IChangePassword {
  currentPassword:string;
  newPassword:string
}


export interface TrainerVerificationList {
  id: string;
  userId: string;
  trainerName: string;
  email: string;
  experienceYear: number;
  approvalStatus: string;
  createdAt: Date;
}