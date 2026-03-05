import { SubscriptionPlanManagementListDTO } from "./subscriptionManagementPlan.dto";


export interface GetSubscriptionPlanResponseDTO{
    subscriptions:SubscriptionPlanManagementListDTO[];
    totals:number;
}