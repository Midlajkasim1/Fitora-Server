import { SessionType } from "@/domain/constants/session.constants";

export class CreateSlotRequestDTO{
    trainerId!:string;
    startTime!:Date;
    endTime!:Date;
    type!:SessionType;
    capacity?:number;
    constructor(data:CreateSlotRequestDTO){
        Object.assign(this,data);
    }

}