export interface UserUpcomingSlotDTO {
  slotId: string;
  trainerName: string;
  startTime: Date;
  endTime: Date;
  type: string;
  status: string;
  trainerProfile?: string;
}

export interface UserUpcomingResponseDTO {
  sessions: UserUpcomingSlotDTO[];
  total: number;
}