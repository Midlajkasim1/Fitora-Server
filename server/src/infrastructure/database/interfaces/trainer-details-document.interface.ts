import { Document, Types } from "mongoose";

export interface ITrainerDetailsDocument extends Document {
  _id: Types.ObjectId;
  user_id: Types.ObjectId; 
  bio: string; 
  experience_year: number; 
  certifications: string[]; 
  specializations: string[]
  approval_status: "pending" | "approved" | "rejected"; 
  verified: boolean; 
  rating: number;
  total_reviews: string; 
  created_at: Date; 
  update_at: Date; 
}