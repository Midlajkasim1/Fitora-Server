import { PlanSessionType } from "@/domain/constants/subscription.constants";


export interface UpdateSubscriptionPlanRequestDTO{
    id:string;
    name:string;
    price?:number | string;
    billingCycle?:string;
    description?:string;
    sessionType?:PlanSessionType;
    sessionCredits?:number;
    aiWorkoutLimit?:number;
    aiDietLimit?:number;

}