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

export interface Specialization {
  id:string;
  name:string;
  description:string;
  imageUrl:string;
}
export interface SpResponse {
  items:Specialization[];
  total:number;
}

export interface StartWorkout{
  id: string;
  difficulty: string;
  duration: number;
}