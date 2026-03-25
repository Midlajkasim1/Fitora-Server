import { TrainerManagementDTO } from "./trainer-management.dto";

export class GetTrainersResponseDTO {
  trainers!: TrainerManagementDTO[];
  total!: number;

  constructor(data: GetTrainersResponseDTO) {
    Object.assign(this, data);
  }
}