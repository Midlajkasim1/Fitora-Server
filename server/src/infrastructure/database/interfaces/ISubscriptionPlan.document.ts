import { PlanSessionType, SubscriptionPlanStatus } from "@/domain/constants/subscription.constants";
import { Types } from "mongoose";

export interface ISubscriptionDocument {
  _id: Types.ObjectId;
    name: string;
    price: string; 
    billingCycle: string;
    description: string;
    status: SubscriptionPlanStatus;
    totalPurchaseUser: number;
    sessionType: PlanSessionType;
    sessionCredits: number;
    hasAiWorkout: boolean;
    hasAiDiet: boolean;
    createdAt: Date;
}