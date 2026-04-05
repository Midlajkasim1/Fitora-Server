import { model } from "mongoose";
import { IDietPlanDocument } from "../interfaces/ai-diet-plan.document";
import { DietPlanSchema } from "../schemas/ai-diet.schema";

export const DietPlanModel = model<IDietPlanDocument>("AiDietPlan", DietPlanSchema);