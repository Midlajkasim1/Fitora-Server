import { AdminStatus } from "@/domain/constants/auth.constants";
import { Types } from "mongoose";

export interface IAdminDocument {
  _id: Types.ObjectId;
  email: string;
  password: string;
  status: AdminStatus;
  createdAt: Date;
  updatedAt: Date;
}