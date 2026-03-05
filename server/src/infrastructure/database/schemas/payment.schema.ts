import { PaymentStatus } from "@/domain/constants/payment.constants";
import { Schema } from "mongoose";

export const PaymentSchema = new Schema({
    user_id:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true 
    },
    subscription_id:{
        type:Schema.Types.ObjectId,
        ref:"Subscription",
    },
    payment_method:{
        type:String,
        required:true
    },
    amount:{
        type:Number,
        required:true 
    },
    status:{
        type:String,
        enum:Object.values(PaymentStatus),
        default:PaymentStatus.PENDING
    },
    provider_payment_id:{
        type:String,
        unique:true,
        sparse:true 
    }
},{timestamps:true});