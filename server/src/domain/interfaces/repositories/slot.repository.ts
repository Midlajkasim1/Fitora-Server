import { SlotEntity } from "@/domain/entities/slot/slot.entity";
import { IBaseRepository } from "./base.repository";
import { Types } from "mongoose";
import { SessionType, SlotStatus } from "@/domain/constants/session.constants";


export interface ISlotRepository extends IBaseRepository<SlotEntity>{
     /** Checks if a trainer has an overlapping slot */
    findOverlappingSlot(trainerId:string,startTime:Date,endTime:Date):Promise<SlotEntity | null>;
    /** Checks if a user (client) has an overlapping booked slot */
    findUserOverlappingSlot(userId:string, startTime:Date, endTime:Date):Promise<SlotEntity | null>;
    findAvailableSlotsByTrainers(params:{trainerIds: string[];skip:number;limit:number;search?:string,type?:SessionType}): Promise<{slots:ISlotWithTrainer[],total:number}>;
    bookSlot(slotId:string,userId:string):Promise<boolean>;
    cancelBooking(slotId:string,userId:string):Promise<boolean>;
    completeSession(slotId: string): Promise<boolean>
     updateStatus(slotId: string, status: SlotStatus): Promise<void>;
     getTrainerParticipants(params:{trainerId:string,type:SessionType,skip:number,limit:number,search?:string}):Promise<ITrainerParticipantsResult>;
     getTrainerUpcomingSlots(params:{trainerId:string,skip:number,limit:number}):Promise<ITrainerUpcomingResult>;
     getUserUpcomingSlots(params:{userId:string,skip:number;limit:number}):Promise<IUserUpcomingResult>;
     getTotalClients(trainerId: string): Promise<number>;
     checkAvaliability(trainerId: string, startTime: Date, endTime: Date, excludeId?: string): Promise<SlotEntity | null>;
     hasActiveOrRecentBooking(userAId: string, userBId: string, gracePeriodLimit: Date): Promise<boolean>;
     /** Returns trainers the user has an active or grace-period booking with.
      *  Grace period: session ended less than 24 hours ago. */
     findActiveChatPartners(userId: string, gracePeriodLimit: Date): Promise<IChatPartner[]>;
     findActiveChatPartnersForTrainer(trainerId: string, gracePeriodLimit: Date): Promise<IChatPartner[]>;
     getClientSessionHistory(trainerId: string, clientId: string): Promise<SlotEntity[]>;
}

export interface IAggregateSlot{
    _id: Types.ObjectId;
  trainerId: Types.ObjectId;
  startTime: Date;
  endTime: Date;
  type: SessionType;
  capacity: number;
  participants: Types.ObjectId[];
  status: SlotStatus;
  trainerInfo: {
    firstName: string;
    lastName: string;
  };
}
export interface ISlotWithTrainer {
  id: string;
  trainerId: string;
  trainerName: string; 
  startTime: Date;
  endTime: Date;
  type: SessionType;
  capacity: number;
  participants: string[];
  status: SlotStatus;
}

export interface ITrainerParticipantRow {
  slotId: Types.ObjectId;
  startTime: Date;
  type: string;
  status:string;
  userId: Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  profileImage?: string;
}

export interface ITrainerParticipantsResult {
  data: ITrainerParticipantRow[];
  total: number;
}

export interface IUpcomingSlot {
  slotId: Types.ObjectId;
  startTime: Date;
  endTime: Date;
  type: string;
  status: string;
  capacity: number;
  bookedCount: number;
}

export interface ITrainerUpcomingResult {
  data: IUpcomingSlot[];
  total: number;
}

export interface IUserUpcomingSlot {
  slotId: Types.ObjectId;
  startTime: Date;
  endTime: Date;
  type: string;
  status: string;
  trainerId: Types.ObjectId;
  trainerName: string;
  trainerProfile?: string;
}

export interface IUserUpcomingResult {
  data: IUserUpcomingSlot[];
  total: number;
}

export interface IChatPartner {
  id: string;
  name: string;
  profileImage?: string;
}
