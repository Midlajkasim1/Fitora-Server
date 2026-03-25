import { SubscriptionPlanStatus } from "@/domain/constants/subscription.constants";
import { SubscriptionPlanEntity } from "@/domain/entities/subscription/subscriptionplan.entity";
import { IBaseRepository } from "./base.repository";



export interface ISubscriptionPlanRepository extends IBaseRepository<SubscriptionPlanEntity> {
    findByName(name:string):Promise<SubscriptionPlanEntity | null>;
    updataStatus(id:string,status:SubscriptionPlanStatus):Promise<void>;
    updatePurchasedCount(planId:string):Promise<void>;
    findAllSPlan(params: { page: number; limit: number; search?: string; status?: SubscriptionPlanStatus; }): Promise<{ data: SubscriptionPlanEntity[]; total: number; }>
}