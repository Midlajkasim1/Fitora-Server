import { SessionType, SlotStatus } from "@/domain/constants/session.constants";

export class CreateSlotResponseDTO{
    id!:string;
    trainerId!:string;
    startTime!:Date;
    endTime!:Date;
    type!:SessionType;
    capacity!:number;
    status!:SlotStatus;
    message!:string;
    constructor(data:CreateSlotResponseDTO){
        Object.assign(this,data);
    }

}