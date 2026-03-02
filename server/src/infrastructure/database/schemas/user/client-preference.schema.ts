import { Schema } from "mongoose";

export const ClientPreferenceSchema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true
    },
    sleep_hours: {
      type: Number,
      required: true
    },
    water_intake: {
      type: Number,
      default: 2000
    },
    primary_motives: {
      type: [String],
      required: true
    },
   preferred_workouts: [
  {
    type: Schema.Types.ObjectId,
    ref: "Specialization",
    required: true
  }
],
    experience_level: {
      type: String,
      required: true
    },
    diet_preference: {
      type: String,
      required: true
    },
    medical_conditions: {
      type: [String],
      default: []
    }
  },
  {
    timestamps: true,

    versionKey: false
  }
);