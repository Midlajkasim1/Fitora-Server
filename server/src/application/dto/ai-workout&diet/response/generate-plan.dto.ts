import { IWorkoutDay } from "@/domain/entities/ai-workout&diet/ai-workout-plan.entity";

export interface GenerateWorkoutResponseDTO {
  success: boolean;
  message: string;
  planId?: string;
  title?: string;
  weeklyPlan?: IWorkoutDay[];
  
}