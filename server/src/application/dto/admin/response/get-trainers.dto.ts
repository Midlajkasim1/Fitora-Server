import { TrainerManagementDTO } from "./trainer-management.dto";

export interface GetTrainersResponseDTO {
  trainers: TrainerManagementDTO[]; 
  total: number;
}