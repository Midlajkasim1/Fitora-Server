import { SubscriptionStatus } from "@/domain/constants/subscription.constants";
import { Types } from "mongoose";

export interface ISubscriptionDocument {
  _id: Types.ObjectId;
    name: string;
    price: string; 
    billingCycle: string;
    description: string;
    status: SubscriptionStatus;
    totalPurchaseUser: number;
    createdAt: Date;
}