import { Document, Types } from "mongoose";
import { AdminStatus } from "@/domain/constants/auth.constants";

export interface IAdminDocument extends Document {
  _id: Types.ObjectId;
  email: string;
  password: string;
  status: AdminStatus;
  createdAt: Date;
  updatedAt: Date;
}