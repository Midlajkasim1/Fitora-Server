import { Schema } from "mongoose";



export const HealthMetricsSchema = new Schema({
    user_id:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    height:{
        type:Number,
        required:true 
    },
    weight:{
        type:Number,
        required:true 
    },
    target_weight:{
        type:Number,
        required:true
    },
    primary_goal:{
        type:String,
        required:true
    }
},{timestamps:true});