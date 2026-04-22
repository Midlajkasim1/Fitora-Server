import { UpcomingSlotDTO } from "../../slot/response/trainer-get-upcomingSlot.dto";

export interface TrainerDashboardResponseDTO {
  totalClients: number;
  upcomingSessions: UpcomingSlotDTO[];
  walletBalance: number;
  monthlyEarnings: number;
}