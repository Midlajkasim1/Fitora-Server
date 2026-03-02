import { ApprovalStatus } from "@/domain/constants/auth.constants";

export interface UpdateTrainerApprovalRequestDTO{
    trainerDetailId:string;
    status:ApprovalStatus;
    reason?:string;
}