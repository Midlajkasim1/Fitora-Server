import { SpecializationManagementDTO } from "./specialization-management.dto";


export  interface GetSpecializationResponseDTO {
    specialization:SpecializationManagementDTO[];
    total:number;
}