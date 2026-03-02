import { WorkoutDifficulty, WorkoutStatus } from "@/domain/constants/workout.constant";
import { Schema } from "mongoose";


export const WorkoutSchema = new Schema({
    title:{
        type:String,
        required:true,
        trim:true
    },
    description:{
        type:String,
        required:true,
    },
    videoUrl:{
    type:String,
    required:true
    },
    specializationId:{
        type:Schema.Types.ObjectId,
        ref:"Specialization",
        required:true 
    },
    difficulty:{
        type:String,
        required:true 
    },
    duration:{
        type:Number,
        required:true 
    },
    caloriesBurn:{
        type:Number,
        required:true 
    },
    bodyFocus:{
        type:String,
        required:true 
    },
    thumbnailUrl:{
        type:String,
        required:true 
    },
    status:{
        type:String,
        enum:Object.values(WorkoutStatus),
        default:"active"
    },


},{timestamps:true});