import { Types } from "mongoose";

export interface IChatMessageDocument {
  _id: Types.ObjectId;
  senderId: Types.ObjectId;
  receiverId: Types.ObjectId;
  message: string;
  isRead: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
