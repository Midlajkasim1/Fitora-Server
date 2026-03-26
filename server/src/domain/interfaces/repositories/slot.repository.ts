import { SlotEntity } from "@/domain/entities/slot/slot.entity";
import { IBaseRepository } from "./base.repository";


export interface ISlotRepository extends IBaseRepository<SlotEntity>{
    findOverlappingSlot(trainerId:string,startTime:Date,endTime:Date):Promise<SlotEntity | null>;
    // findAvailableSlot(type?: string): Promise<SlotEntity[]>
    findAvailableSlotsByTrainers(trainerIds: string[]): Promise<SlotEntity[]>
}