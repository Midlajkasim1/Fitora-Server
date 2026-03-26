import { SlotEntity } from "@/domain/entities/slot/slot.entity";
import { BaseRepository } from "./base.repository";
import { ISlotDocument } from "../interfaces/slot-document.interface";
import { SlotMapper } from "../mappers/slot.mapper";
import { SlotModel } from "../models/slots.models";
import { Model, Types } from "mongoose";
import { ISlotRepository } from "@/domain/interfaces/repositories/slot.repository";
import { SlotStatus } from "@/domain/constants/session.constants";

export class  SlotRespository extends BaseRepository<SlotEntity,ISlotDocument> implements ISlotRepository{
    constructor(
        private readonly _slotMapper:SlotMapper
    ){
        super(SlotModel as unknown as Model<ISlotDocument>,_slotMapper);
    }
    async findOverlappingSlot(trainerId: string, startTime: Date, endTime: Date): Promise<SlotEntity | null> {
        const doc = await SlotModel.findOne({
            trainerId:new Types.ObjectId(trainerId),
            status:{$ne:SlotStatus.CANCELLED},
            $or:[
                {startTime:{$lt:endTime,$gte:startTime}},
                {endTime:{$gt:startTime,$lte:endTime}},
                {startTime:{$lte:startTime,}},
                {endTime:{$gte:endTime}}
            ]
        }).lean();
        return doc ? this._slotMapper.toEntity(doc as ISlotDocument): null;
    }
  

//  async findAvailableSlot(type?: string): Promise<SlotEntity[]> {
//     const query: Record<string, unknown> = {
//       status: SlotStatus.AVAILABLE,
//       startTime: { $gt: new Date() } 
//     };

//     if (type) {
//       query.type = type;
//     }

//     const docs = await SlotModel.find(query).sort({ startTime: 1 }).lean().exec();

//     return docs.map(doc => this._slotMapper.toEntity(doc as ISlotDocument));
//   }
async findAvailableSlotsByTrainers(trainerIds: string[]): Promise<SlotEntity[]> {
    const mongoTrainerIds = trainerIds.map(id => new Types.ObjectId(id));
        const query: Record<string, unknown> = {
        trainerId: { $in: mongoTrainerIds },
        status: SlotStatus.AVAILABLE,
        startTime: { $gt: new Date() } 
    };

    const docs = await SlotModel.find(query)
        .sort({ startTime: 1 })
        .lean()
        .exec();

    return docs.map(doc => this._slotMapper.toEntity(doc as ISlotDocument));
}
}