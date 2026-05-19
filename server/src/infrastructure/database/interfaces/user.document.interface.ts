import {  Types } from "mongoose";
import { UserRole, UserStatus } from "@/domain/constants/auth.constants";

export interface IUserDocument  {
  _id: Types.ObjectId; 
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: UserRole;
  status: UserStatus; 
  profileImage?:string | null;
  isEmailVerified: boolean;
  dob?: Date | null;
  gender?: string | null;
  isOnboardingRequired: boolean;

  password?: string | null;
authProvider: "local" | "google";
  googleId?: string | null;
  createdAt: Date;
  updatedAt: Date;
}