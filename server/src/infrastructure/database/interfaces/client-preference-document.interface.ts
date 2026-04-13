import { DietPreference, ExperienceLevel } from "@/domain/constants/auth.constants";
import {  Types } from "mongoose";

export interface IClientPreferenceDocument  {
  _id: Types.ObjectId;
  user_id: Types.ObjectId; 
  sleep_hours: number; 
  water_intake: number; 
  primary_motives: string[]; 
  preferred_workouts: Types.ObjectId; 
  experience_level: ExperienceLevel; 
  diet_preference: DietPreference; 
  medical_conditions: string[];
  created_at: Date; 
  update_at: Date;
}