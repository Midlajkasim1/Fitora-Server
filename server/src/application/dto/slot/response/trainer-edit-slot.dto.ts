import { SessionType, SlotStatus } from "@/domain/constants/session.constants";

export interface EditSlotResponseDTO {
    id: string;
    startTime: Date;
    endTime: Date;
    type: SessionType;
    capacity: number;
    status: SlotStatus;
    message: string;
}