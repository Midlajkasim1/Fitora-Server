import { SubscriptionPlanStatus } from "@/domain/constants/subscription.constants";


export interface GetSubscriptionPlanRequestDTO{
page:number;
limit:number;
 search?:string;
status?:SubscriptionPlanStatus;
}
