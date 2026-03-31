import { SessionType, SlotStatus } from "@/domain/constants/session.constants";

export interface AvailableSlotResponseDTO {
  id: string;
  trainerId: string;
  trainerName: string;
  startTime: Date;
  endTime: Date;
  type: SessionType;
  capacity: number;
  availableSeats: number;
  status: SlotStatus;
}
export interface AvailableSlotsPagedResponseDTO {
    slots: AvailableSlotResponseDTO[];
    total: number;
}