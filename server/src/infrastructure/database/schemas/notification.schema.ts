import { NotificationType } from "@/domain/constants/notification.constants";
import { Schema } from "mongoose";


export const NotificationSchema = new Schema({
   userId: { 
      type: Schema.Types.ObjectId, 
      ref: "User", 
      required: true,
      index: true
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: { 
      type: String, 
      enum: Object.values(NotificationType), 
      required: true 
    },
    isRead: { type: Boolean, default: false },
  },
  {timestamps:true}
);