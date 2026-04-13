import { AiDietPlanEntity } from "@/domain/entities/ai-workout&diet/ai-diet-plan.entity";
import { IMapper } from "@/domain/interfaces/services/mapper.interface";
import { Types } from "mongoose";
import { IDietPlanDocument } from "../interfaces/ai-diet-plan.document";

export class AiDietPlanMapper implements IMapper<AiDietPlanEntity, IDietPlanDocument> {
  toEntity(doc: IDietPlanDocument): AiDietPlanEntity {
    return new AiDietPlanEntity({
      id: doc._id.toString(),
      userId: doc.userId.toString(),
      title: doc.title,
      description: doc.description,
      weeklyPlan: Array.isArray(doc.weeklyPlan) ? doc.weeklyPlan : [],
      createdAt: doc.createdAt,
    });
  }

  toMongo(entity: AiDietPlanEntity): Partial<IDietPlanDocument> {
    return {
      userId: new Types.ObjectId(entity.userId),
      title: entity.title,
      description: entity.description,
      weeklyPlan: entity.weeklyPlan,
      createdAt: entity.createdAt,
    };
  }
}