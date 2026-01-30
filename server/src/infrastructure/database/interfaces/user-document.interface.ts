import { Document, Types } from "mongoose";
import { UserRole, UserStatus, AuthProvider } from "@/domain/constants/auth.constants";

export interface IUserDocument extends Document {
  _id: Types.ObjectId; 
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: UserRole;
  status: UserStatus; 
  isEmailVerified: boolean;
  dob?: Date;
  gender?: string;
  isOnboardingRequired: boolean;

  password?: string;
  authProvider: AuthProvider;
  googleId?: string | null;
  createdAt: Date;
  updatedAt: Date;
}