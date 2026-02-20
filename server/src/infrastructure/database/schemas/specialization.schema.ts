import { SpecializationStatus } from "@/domain/constants/auth.constants";
import { Schema } from "mongoose";


export const SpecializationSchema = new Schema({
    name:{
        type:String,
        required:true,
        unique:true,
        trim:true
    },
    description:{
        type:String,
    },
    imageUrl:{
     type:String,
    },
    status:{
        type:String,
        enum:["active","blocked"],
        default:SpecializationStatus.ACTIVE
        
    }
},{
    timestamps:{
        createdAt:"created_at",
        updatedAt:"updated_at"
    }
});