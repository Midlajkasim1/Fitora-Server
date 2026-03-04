import { SubscriptionStatus } from "@/domain/constants/subscription.constants";


export interface GetSubscriptionRequestDTO{
page:number;
limit:number;
 search?:string;
status?:SubscriptionStatus;
}