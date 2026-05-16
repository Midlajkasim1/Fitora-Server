import { Schema } from "mongoose";

export const ChatMessageSchema = new Schema(
  {
    senderId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    receiverId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    message: {
      type: String,
      required: false,
      maxlength: 5000,
      trim: true,
    },
    attachmentUrl: {
      type: String,
      required: false,
    },
    attachmentType: {
      type: String,
      enum: ["image", "video", "audio", "file"],
      required: false,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

ChatMessageSchema.index({ senderId: 1, receiverId: 1, createdAt: -1 });
ChatMessageSchema.index({ receiverId: 1, senderId: 1, createdAt: -1 });
