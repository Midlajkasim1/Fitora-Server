import { AiWorkoutPlanEntity } from "@/domain/entities/ai-workout&diet/ai-workout-plan.entity";
import { IBaseRepository } from "./base.repository";

export interface IAiWorkoutPlanRepository extends IBaseRepository<AiWorkoutPlanEntity> {
    findByUserId(userId: string): Promise<AiWorkoutPlanEntity[]>;
    findLatestByUserId(userId: string): Promise<AiWorkoutPlanEntity | null>;
    count(filter:Record<string,unknown>):Promise<number>;
}