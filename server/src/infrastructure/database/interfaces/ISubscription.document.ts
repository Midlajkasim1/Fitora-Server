import { Types } from "mongoose";

export interface ISubscriptionDocument {
    _id: Types.ObjectId ;
    plan_id: Types.ObjectId | string;
    user_id: Types.ObjectId | string;
    status: string;
    start_date: Date;
    end_date: Date;
}