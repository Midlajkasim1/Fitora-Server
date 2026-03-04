import { SubscriptionStatus } from "@/domain/constants/subscription.constants";


export interface SubscriptionManagementListDTO{
    id?:string;
    name:string;
    price:string | number;
    billingCycle:string;
    status:SubscriptionStatus;
    createdAt:Date;
    totalPurchaseUser:number;
}   