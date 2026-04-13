import { IDietDay } from "@/domain/entities/ai-workout&diet/ai-diet-plan.entity";

export interface GenerateDietResponseDTO {
  success: boolean;
  message: string;
  planId?: string;
  title?: string;
  weeklyPlan?: IDietDay[];
}