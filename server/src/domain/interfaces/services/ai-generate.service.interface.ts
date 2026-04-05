import { AiDietPlanEntity } from "@/domain/entities/ai-workout&diet/ai-diet-plan";
import { AiWorkoutPlanEntity } from "@/domain/entities/ai-workout&diet/ai-workout-plan.entity";

export interface IAiService {
  generateWorkoutPlan(
    userId: string, 
    metrics: IUserFitnessMetrics
  ): Promise<AiWorkoutPlanEntity>;

  generateDietPlan(
    userId: string, 
    metrics: IUserDietMetrics
  ): Promise<AiDietPlanEntity>;
}

export interface IUserFitnessMetrics {
  weight: number;
  height: number;
  goal: string;
  level: string;
  equipment: string[];
  specializations: string[];
}

export interface IUserDietMetrics {
  weight: number;
  height: number;
  goal: string;
  preference: string;
  limitations: string[];
  targetCalories: number;
}