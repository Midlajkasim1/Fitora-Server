
import { ApprovalStatus } from "@/domain/constants/auth.constants";
import { IBaseRepository } from "../base.repository";
import { TrainerDetailsEntity } from "@/domain/entities/user/trainer-details.entity";
import { UserEntity } from "@/domain/entities/user/user.entity";
export interface ITrainerRepository extends IBaseRepository<TrainerDetailsEntity> {

  save(details: TrainerDetailsEntity): Promise<void>;
  findAllTrainers(params:{
  page: number;
    limit: number;
    search?: string;
    status?: string;
    specialization?: string;}):Promise<{data:UserEntity[],total:number}>
  findByUserId(userId: string): Promise<TrainerDetailsEntity | null>;
  findAllTrainerVerification(params:{
    page:number;
    limit:number;
    search?:string,
    approvalStatus?:string
  }):Promise<{data:TrainerDetailsEntity[],total:number}>
  updateApprovalStatus(id:string,status:ApprovalStatus,reason?:string):Promise<void>;
  findApprovedTrainer(): Promise<string[]>;
  findTrainerIdsBySpecializations(specializationIds: string[]): Promise<string[]>;
}