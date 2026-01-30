import { DietPreference, ExperienceLevel } from "@/domain/constants/auth.constants";
import { Document, Types } from "mongoose";

export interface IClientPreferenceDocument extends Document {
  _id: Types.ObjectId;
  user_id: Types.ObjectId; 
  sleep_hours: number; 
  water_intake: number; 
  primary_motives: string[]; 
  preferred_workouts: string[]; 
  experience_level: ExperienceLevel; 
  diet_preference: DietPreference; 
  medical_conditions: string[];
  created_at: Date; 
  update_at: Date;
}