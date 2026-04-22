import {  Types } from "mongoose";

export interface ITrainerDetailsDocument  {
  _id: Types.ObjectId;
  user_id: Types.ObjectId; 
  bio: string; 
  experience_year: number; 
  certifications: string[]; 
  specializations: string;
  approval_status: "pending" | "approved" | "rejected"; 
  verified: boolean; 
  rating: number;
  total_reviews: number; 
  wallet_balance: number;
  created_at: Date; 
  update_at: Date; 
}