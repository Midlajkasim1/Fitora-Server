import { NotificationType } from "@/domain/constants/notification.constants";
import { Types } from "mongoose";

export interface INotificationDocument extends Document {
 _id: Types.ObjectId;
  userId: Types.ObjectId;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}