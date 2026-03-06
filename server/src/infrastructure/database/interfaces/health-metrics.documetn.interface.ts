import { Types } from "mongoose";

export interface IHealthMetricsDocument  {
  _id: Types.ObjectId;
  user_id: Types.ObjectId;
  height: number;
  weight: number;
  target_weight: number;
  primary_goal: string;
  created_at: Date;
}