import { Types } from "mongoose";

export interface IPaymentDocument {
    _id: Types.ObjectId;
    user_id: Types.ObjectId;
    subscription_id?: Types.ObjectId;
    amount: number;
    trainerAmount: number;
    status: string;
    provider_payment_id?: string;
    payment_method: string;
    createdAt: Date;
    updatedAt: Date;
}