import { IDietDay, IMeal } from "@/domain/entities/ai-workout&diet/ai-diet-plan";
import { IDietPlanDocument } from "../interfaces/ai-diet-plan.document";
import { Schema } from "mongoose";

const MealSchema = new Schema<IMeal>({
  name: { type: String, required: true },
  time: { type: String, required: true },
  foods: [{ type: String }],
  calories: { type: Number, required: true },
  protein: { type: Number, required: true },
  carbs: { type: Number, required: true },
  fats: { type: Number, required: true },
  notes: String,
});

const DietDaySchema = new Schema<IDietDay>({
  day: { type: String, required: true },
  meals: [MealSchema],
  totalCalories: { type: Number, required: true },
  totalProtein: { type: Number, required: true },
  totalCarbs: { type: Number, required: true },
  totalFats: { type: Number, required: true },
  waterIntake: { type: Number, required: true },
  notes: String,
});

 export const DietPlanSchema = new Schema<IDietPlanDocument>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  weeklyPlan: [DietDaySchema],
  createdAt: { type: Date, default: Date.now },
});