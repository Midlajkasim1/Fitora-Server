export interface UpcomingSlotDTO {
  slotId: string;
  startTime: Date;
  endTime: Date;
  type: string;
  status: string;
  capacity: number;
  bookedCount: number;
}

export interface TrainerUpcomingResponseDTO {
  slots: UpcomingSlotDTO[];
  total: number;
}