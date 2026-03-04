import { model } from "mongoose";
import { SubscriptionSchema } from "../schemas/subscription.schema";


export const SubscriptionModel = model("Subscription",SubscriptionSchema);