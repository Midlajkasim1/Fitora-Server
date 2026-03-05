import { model } from "mongoose";
import { SubscriptionPlanSchema } from "../schemas/subscriptionPlan.schema";


export const SubscriptionPlanModel = model("SubscriptionPlan",SubscriptionPlanSchema);