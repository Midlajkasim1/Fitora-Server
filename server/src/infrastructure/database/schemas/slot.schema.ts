import { SessionType, SlotStatus } from "@/domain/constants/session.constants";
import { Schema } from "mongoose";


export const SlotSchema = new Schema({
    trainerId:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    startTime:{
        type:Date,
        required:true
    },
    endTime:{
        type:Date,
        required:true
    },
    type:{
        type:String,
        enum:Object.values(SessionType),
        required:true
    },
    capacity:{
        type:Number,
        required:true
    },
    participants:[{
        type:Schema.Types.ObjectId,
        ref:"User",

    }],
    status:{
        type:String,
        enum:Object.values(SlotStatus),
        default:SlotStatus.AVAILABLE
    }

},{timestamps:true});