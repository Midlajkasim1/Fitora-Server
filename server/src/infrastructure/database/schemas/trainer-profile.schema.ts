import { Schema, Types } from "mongoose";

const ObjectId = Types.ObjectId;

export const TrainerProfileSchema = new Schema(
  {
    user_id: {
      type: ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },

    bio: {
      type: String,
      trim: true,
    },

    certifications: [
      {
        type: String,
      },
    ],

    experienceYears: {
      type: Number,
      min: 0,
    },

    specializations: [
      {
        type: ObjectId,
        ref: "Specialization",
      },
    ],

    approvalStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    verified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
