import { SubscriptionStatus } from "@/domain/constants/subscription.constants";
import { Schema } from "mongoose";


export const SubscriptionSchema =  new Schema({
    plan_id:{
        type:Schema.Types.ObjectId,
        ref:"SubscriptionPlan",
        required:true 
    },
    user_id:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    status:{
        type:String,
        enum:Object.values(SubscriptionStatus),
        default:SubscriptionStatus.PENDING
    },
    start_date:{
        type:Date,
        required:true
    },
    end_date:{
        type:Date,
        required:true 
    },
    usedCredits:{
        type:Number,
        default:0
    }

},{timestamps:true});