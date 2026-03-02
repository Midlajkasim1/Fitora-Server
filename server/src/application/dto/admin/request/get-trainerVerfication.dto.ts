import { ApprovalStatus } from "@/domain/constants/auth.constants";


export interface GetTrainerVerificationRequestDTO{
    page:number;
    limit:number;
    search?:string;
    approvalStatus?:ApprovalStatus
}
