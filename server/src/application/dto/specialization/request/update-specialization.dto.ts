import { SpecializationStatus } from "@/domain/constants/auth.constants";

export interface UpdateSpecializationDTO {
     id:string;
    name:string;
    description?:string;
    status?:SpecializationStatus;
}