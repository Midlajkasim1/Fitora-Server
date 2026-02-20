import { Schema } from "mongoose";
import { IUserDocument } from "../../interfaces/user-document.interface";
import { UserRole, UserStatus } from "@/domain/constants/auth.constants";

export const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    password: {
      type: String,
      required: function (this: IUserDocument) {
        return this.authProvider === "local";
      },
      select: false,
    },
    dob: {
      type: Date,
      default: null,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      default: null,
    },
    isOnboardingRequired: {
      type: Boolean,
      default: true,
    },

    authProvider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },

    googleId: {
      type: String,
      default: null,
      index: true,
    },
    role: {
      type: String,
      enum: [UserRole.USER, UserRole.TRAINER],
      required: true,
      default: "user",
    },

   status: {
  type: String,
  enum: Object.values(UserStatus),
  default: UserStatus.ACTIVE
},

    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    lastLoginAt: {
      type: Date,
      default: null,
    },

    firstName: {
      type: String,
      required: true,
      trim: true,
    },

    lastName: {
      type: String,
      required: true,
      trim: true,
    },

  phone: {
      type: String,
      required: function (this: IUserDocument) {
        return this.authProvider === "local";
      },
      index: true,
      default: "", 
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);