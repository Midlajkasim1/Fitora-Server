import { SpecializationStatus } from "@/domain/constants/auth.constants";


export interface CreateSpecializationDTO {
    name:string;
    description?:string;
    imageUrl?:string;
    status?:SpecializationStatus
}