import { AdvertisementStatus } from "@/domain/constants/advertisment.constants";
import { Schema } from "mongoose";



export const AdvertisementSchema = new Schema({
  brandName:{
    type:String,
    required:true,
    trim:true
  },
  startDate:{
    type:Date,
    required:true 
  },
  expiryDate:{
    type:Date,
    required:true 
  },
  brandLink:{
    type:String,
    required:true
  },
  bannerImages:{
    type:[String],
    required:true ,
    validate:[(val:string[])=>val.length>0,"atleast one image is required"]
  },
  description:{
    type:String,
    trim:true 
  },
  status:{
    type:String,
    enum:Object.values(AdvertisementStatus),
    default:AdvertisementStatus.ACTIVE
  }
},{timestamps:true});