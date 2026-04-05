import { model } from "mongoose";
import { IWorkoutPlanDocument } from "../interfaces/ai-workout-plan.document";
import { WorkoutPlanSchema } from "../schemas/ai-workout.schema";

export const WorkoutPlanModel = model<IWorkoutPlanDocument>("AiWorkoutPlan", WorkoutPlanSchema);