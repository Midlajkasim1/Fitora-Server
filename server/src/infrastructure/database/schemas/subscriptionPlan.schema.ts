import { PlanSessionType, SubscriptionPlanStatus } from "@/domain/constants/subscription.constants";
import { Schema } from "mongoose";


export const SubscriptionPlanSchema = new Schema({
    name:{
        type:String,
        required:true,
        unique:true
    },
    price:{
        type:String,
        required:true

    },
    billingCycle:{
        type:String,
        required:true 
    },
    description:{
        type:String,
        required:true 
    },
    status:{
        type:String,
        enum:Object.values(SubscriptionPlanStatus),
        default:SubscriptionPlanStatus.ACTIVE
    },
    sessionType:{
        type:String,
        enum:Object.values(PlanSessionType),
        default:PlanSessionType.NONE
    },
    sessionCredits:{
        type:Number,
        default:0
    },
    aiWorkoutLimit:{
        type:Number,
        default:0
    },
    aiDietLimit:{
        type:Number,
        default:0
    },
    totalPurchaseUser:{
        type:Number,
        default:0
    }
},{timestamps:true});