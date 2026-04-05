import { IWorkoutDay } from "@/domain/entities/ai-workout&diet/ai-workout-plan.entity";
import { Types } from "mongoose";

export interface IWorkoutPlanDocument extends Document {
    _id:Types.ObjectId;
  userId: Types.ObjectId;
  title: string;
  description: string;
  weeklyPlan: IWorkoutDay[];
  createdAt: Date;
}