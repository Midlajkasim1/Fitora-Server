import { SpecializationStatus } from "@/domain/constants/auth.constants";


export interface UpdateStatusResponseDTO {
   
    specializationId:string;
    name:string;
    status?:SpecializationStatus;
    message:string;

}