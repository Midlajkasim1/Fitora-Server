import { SpecializationStatus } from "@/domain/constants/auth.constants";


export interface SpecializationManagementDTO {
 id?: string;
 name:string;
 description?:string;
 imageUrl?:string;
 status?:SpecializationStatus
}