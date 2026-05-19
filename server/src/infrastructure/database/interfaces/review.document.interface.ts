import { Types } from "mongoose";

export interface IReviewDocument {
  _id: Types.ObjectId;
  booking_id: Types.ObjectId;
  user_id: Types.ObjectId;
  trainer_id: Types.ObjectId;
  rating: number;
  comment: string;
  created_at: Date;
  updated_at: Date;
}
