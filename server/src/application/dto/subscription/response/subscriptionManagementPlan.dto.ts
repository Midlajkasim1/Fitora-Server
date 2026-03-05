import { SubscriptionPlanStatus } from "@/domain/constants/subscription.constants";


export interface SubscriptionPlanManagementListDTO{
    id?:string;
    name:string;
    price:string | number;
    billingCycle:string;
    description?:string;
    status:SubscriptionPlanStatus;
    createdAt:Date;
    totalPurchaseUser:number;
}   