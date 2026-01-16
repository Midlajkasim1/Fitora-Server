import { Schema, Types } from "mongoose";

const ObjectId = Types.ObjectId;

export const UserProfileSchema = new Schema(
  {
    user_id: {
      type: ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
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
      required: true,
      index: true,
    },

    profileImage: {
      type: String,
      default: null,
    },
  },
  { timestamps: true, versionKey: false }
);
