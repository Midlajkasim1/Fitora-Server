import { TrainerVerificationListDTO } from "./trainer-verficationManagement.dto";

export interface GetTrainerVerificationResponseDTO {
    trainers:TrainerVerificationListDTO[];
    total:number
}