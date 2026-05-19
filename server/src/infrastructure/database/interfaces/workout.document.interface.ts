import {  WorkoutStatus } from "@/domain/constants/workout.constant";
import { Types } from "mongoose";

export interface IWorkoutDocument  {
  _id:Types.ObjectId
  title: string;
  description: string;
  specializationId: Types.ObjectId;
  difficulty: string;
  duration: number;
  caloriesBurn: number;
  bodyFocus: string;
  videoUrl: string;
  thumbnailUrl: string;
  status: WorkoutStatus;
  createdAt: Date;
  updatedAt: Date;
}