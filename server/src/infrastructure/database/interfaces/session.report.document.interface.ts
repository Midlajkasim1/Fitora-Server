import { Types } from "mongoose";

export interface ISessionReportDocument {
  _id: Types.ObjectId;
  booking_id: Types.ObjectId;
  content: string;
  metrics?: Record<string, unknown>;
  is_private: boolean;
}
