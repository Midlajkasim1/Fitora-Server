import { AdminRole, AdminStatus } from "@/domain/constants/auth.constants";
import { Types } from "mongoose";

export interface IAdminDocument {
  _id: Types.ObjectId;
  email: string;
  password: string;
  status: AdminStatus;
  role:AdminRole.ADMIN;
  createdAt: Date;
  updatedAt: Date;
}