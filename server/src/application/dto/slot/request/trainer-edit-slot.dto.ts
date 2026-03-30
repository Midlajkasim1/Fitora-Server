import { SessionType } from "@/domain/constants/session.constants";

export class TrainerEditSlotRequestDTO {
    slotId!: string;
    trainerId!: string;
    startTime!: Date;
    endTime!: Date;
    type!: SessionType;
    capacity!: number;

    constructor(data: TrainerEditSlotRequestDTO) {
        Object.assign(this, data);
    }
}