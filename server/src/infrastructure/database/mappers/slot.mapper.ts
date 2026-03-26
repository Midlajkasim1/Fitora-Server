import { SlotEntity } from "@/domain/entities/slot/slot.entity";
import { IMapper } from "@/domain/interfaces/services/mapper.interface";
import { ISlotDocument } from "../interfaces/slot-document.interface";
import { Types } from "mongoose";

export class SlotMapper implements IMapper<SlotEntity,ISlotDocument>{
    toEntity(doc: ISlotDocument): SlotEntity {
        return SlotEntity.create({
            id:doc._id.toString(),
            trainerId:doc.trainerId.toString(),
            startTime:doc.startTime,
            endTime:doc.endTime,
            type:doc.type,
            capacity:doc.capacity,
            participants:doc.participants.map(p=>p.toString()),
            status:doc.status
        });
    }
    toMongo(entity: SlotEntity): Partial<ISlotDocument> {
         return {
            trainerId:new Types.ObjectId(entity.trainerId),
            startTime:entity.startTime,
            endTime:entity.endTime,
            type:entity.type,
            capacity:entity.capacity,
            participants:entity.participants.map(p=>new Types.ObjectId(p)),
            status:entity.status

      };
    }
}