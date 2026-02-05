import type { TrainerApprovalStatus } from "./onboarding.types";

export type UserRole = "user" | "trainer" | "admin";
export type UserStatus = "active" | "blocked";
export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?:string;
  role: UserRole;
  status?:UserStatus;
  profileImage?: string;
  isOnboardingRequired: boolean;
  approval_status?: TrainerApprovalStatus; 
  createdAt?: string | Date;
}






export type RegisterPayload = {
  role: 'user' | 'trainer';
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  password: string;
};

export type VerifyOtp = {
  email: string;
  otp: string;
};

export type ResendOtp = {
  email: string;
};

export type ForgotPasswordPayload = {
  email: string;
};

export type VerifyResetOtpPayload = {
  email: string;
  otp: string;
};

export type ResetPasswordPayload = {
  token: string;
  password: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};


