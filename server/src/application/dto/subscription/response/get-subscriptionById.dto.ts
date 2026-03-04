import { SubscriptionStatus } from "@/domain/constants/subscription.constants";



export interface GetSubscriptionByIdResponseDTO{
    id:string;
    name:string;
    price:number | string;
    billingCycle:string;
    description:string;
    status?:SubscriptionStatus
    createdAt:Date;
}