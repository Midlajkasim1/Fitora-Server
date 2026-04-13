import { Types } from "mongoose";
import { IWorkoutPlanDocument } from "../interfaces/ai-workout-plan.document";
import { AiWorkoutPlanEntity } from "@/domain/entities/ai-workout&diet/ai-workout-plan.entity";
import { IMapper } from "@/domain/interfaces/services/mapper.interface";

export class AiWorkoutPlanMapper implements IMapper<AiWorkoutPlanEntity, IWorkoutPlanDocument> {
  toEntity(doc: IWorkoutPlanDocument): AiWorkoutPlanEntity {
    return new AiWorkoutPlanEntity({
      id: doc._id.toString(),
      userId: doc.userId.toString(),
      title: doc.title,
      description: doc.description,
      weeklyPlan: Array.isArray(doc.weeklyPlan) ? doc.weeklyPlan : [],
      createdAt: doc.createdAt,
    });
  }

  toMongo(entity: AiWorkoutPlanEntity): Partial<IWorkoutPlanDocument> {
    return {
      userId: new Types.ObjectId(entity.userId),
      title: entity.title,
      description: entity.description,
      weeklyPlan: entity.weeklyPlan,
      createdAt: entity.createdAt,
    };
  }
}