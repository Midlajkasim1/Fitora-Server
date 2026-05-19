import { SpecializationStatus } from "@/domain/constants/auth.constants";
import {  Types } from "mongoose";


export interface ISpecializationDocument  {
    _id:Types.ObjectId;
    name:string;
    description:string;
    imageUrl:string;
    status:SpecializationStatus;
    createdAt:Date;
    updatedAt:Date;
}