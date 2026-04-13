import { IDietDay } from "@/domain/entities/ai-workout&diet/ai-diet-plan.entity";
import { Types } from "mongoose";

export interface IDietPlanDocument extends Document {
    _id:Types.ObjectId;
  userId: Types.ObjectId;
  title: string;
  description: string;
  weeklyPlan: IDietDay[];
  createdAt: Date;
}