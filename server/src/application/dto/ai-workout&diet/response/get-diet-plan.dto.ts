import { IDietDay } from "@/domain/entities/ai-workout&diet/ai-diet-plan.entity";

export interface GetDietPlanResponseDTO {
  success: boolean;
  message: string;
  planId: string;
  title: string;
  weeklyPlan: IDietDay[];
}