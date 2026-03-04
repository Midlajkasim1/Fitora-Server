import { SubscriptionManagementListDTO } from "./subscriptionManagement.dto";


export interface GetSubscriptionResponseDTO{
    subscriptions:SubscriptionManagementListDTO[];
    totals:number;
}