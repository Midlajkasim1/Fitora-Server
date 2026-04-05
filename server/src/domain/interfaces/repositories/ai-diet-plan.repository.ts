import { AiDietPlanEntity } from "@/domain/entities/ai-workout&diet/ai-diet-plan";
import { IBaseRepository } from "./base.repository";

export interface IAiDietPlanRepository extends IBaseRepository<AiDietPlanEntity> {
    findByUserId(userId: string): Promise<AiDietPlanEntity[]>;
    findLatestByUserId(userId: string): Promise<AiDietPlanEntity | null>;
}