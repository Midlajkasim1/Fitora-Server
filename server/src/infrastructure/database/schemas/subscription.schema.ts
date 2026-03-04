import { SubscriptionStatus } from "@/domain/constants/subscription.constants";
import { Schema } from "mongoose";


export const SubscriptionSchema = new Schema({
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
        enum:Object.values(SubscriptionStatus),
        default:SubscriptionStatus.ACTIVE
    },
    totalPurchaseUser:{
        type:Number,
        default:0
    }
},{timestamps:true});