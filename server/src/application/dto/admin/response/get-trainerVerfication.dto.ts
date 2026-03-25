import { TrainerVerificationListDTO } from "./trainer-verficationManagement.dto";

export class GetTrainerVerificationResponseDTO {
  trainers!: TrainerVerificationListDTO[];
  total!: number;

  constructor(data: GetTrainerVerificationResponseDTO) {
    Object.assign(this, data);
  }
}