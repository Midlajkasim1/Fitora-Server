import { SessionType, SlotStatus } from "@/domain/constants/session.constants";
import { Types } from "mongoose";

export interface ISlotDocument {
    _id: Types.ObjectId;
    trainerId: Types.ObjectId; 
    startTime: Date;          
    endTime: Date;            
    type: SessionType;
    capacity: number;
    participants: Types.ObjectId[];
    status: SlotStatus;
    createdAt?: Date;
    updatedAt?: Date;

}