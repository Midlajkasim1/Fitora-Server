import { Types } from "mongoose";
import { IMapper } from "@/domain/interfaces/services/mapper.interface";
import { IHealthMetricsDocument } from "../interfaces/health-metrics.documetn.interface";
import { HealthMetricsEntity } from "@/domain/entities/user/client-health-metrics.entity";

export class HealthMetricsMapper implements IMapper<HealthMetricsEntity, IHealthMetricsDocument> {
  toEntity(doc: IHealthMetricsDocument): HealthMetricsEntity {
    return new HealthMetricsEntity({
      id: doc._id.toString(),
      userId: doc.user_id.toString(),
      height: doc.height,
      weight: doc.weight,
      targetWeight: doc.target_weight,
      primaryGoal: doc.primary_goal
    });
  }

  toMongo(entity: HealthMetricsEntity): Partial<IHealthMetricsDocument> {
    return {
      user_id: new Types.ObjectId(entity.userId),
      height: entity.height,
      weight: entity.weight,
      target_weight: entity.targetWeight,
      primary_goal: entity.primaryGoal
    };
  }
}