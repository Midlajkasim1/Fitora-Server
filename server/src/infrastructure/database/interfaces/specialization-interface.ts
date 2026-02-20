import { SpecializationStatus } from "@/domain/constants/auth.constants";
import { Document, Types } from "mongoose";


export interface ISpecializationDocument extends Document {
    _id:Types.ObjectId;
    name:string;
    description:string;
    imageUrl:string;
    status:SpecializationStatus;
    createdAt:Date;
    updatedAt:Date;
}