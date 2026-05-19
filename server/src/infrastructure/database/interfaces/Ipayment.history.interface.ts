import { PaymentStatus } from "@/domain/constants/payment.constants";
import { SubscriptionStatus } from "@/domain/constants/subscription.constants";
import { Types } from "mongoose";

export interface IPaymentHistory {
    _id: Types.ObjectId;
    amount: number;
    status: PaymentStatus;
    payment_method: string;
    sub?: {
        status: SubscriptionStatus;
    }
    createdAt: Date;
    planDetails: { name: string }[];
}