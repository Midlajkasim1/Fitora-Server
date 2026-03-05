import { SubscriptionPlanStatus } from "@/domain/constants/subscription.constants";



export interface GetSubscriptionPlanByIdResponseDTO{
    id:string;
    name:string;
    price:number | string;
    billingCycle:string;
    description:string;
    status?:SubscriptionPlanStatus
    createdAt:Date;
}