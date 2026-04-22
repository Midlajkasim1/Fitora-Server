import { Schema } from "mongoose";

export const SessionReportSchema = new Schema(
  {
    booking_id: {
      type: Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
      unique: true,
      index: true
    },
    content: {
      type: String,
      required: true
    },
    metrics: {
      type: Schema.Types.Mixed,
      default: {}
    },
    is_private: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at"
    },
    versionKey: false
  }
);
