import { ApprovalStatus } from "@/domain/constants/auth.constants";



export interface TrainerVerificationListDTO {
    id:string;
    userId:string;
    trainerName:string;
    email:string;
    experienceYear:number;
    approvalStatus:ApprovalStatus;
    createdAt:Date;
}