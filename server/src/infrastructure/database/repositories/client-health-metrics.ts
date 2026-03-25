import { Model, Types } from "mongoose";
import { HealthMetricsMapper } from "../mappers/client-health-metrics.mapper";
import { HealthMetricsEntity } from "@/domain/entities/user/client-health-metrics.entity";
import { HealthMetricsModel } from "../models/client-health-metrics.models";
import { IHealthMetricsDocument } from "../interfaces/health-metrics.documetn.interface";
import { IHealthMetricsRepository } from "@/domain/interfaces/repositories/onboarding/iclient-health-metrics.interface";
import { BaseRepository } from "./base.repository";

export class HealthMetricsRepository extends BaseRepository<HealthMetricsEntity,IHealthMetricsDocument> implements IHealthMetricsRepository{
  constructor(private readonly _healthMetricsmapper: HealthMetricsMapper) {
    super(HealthMetricsModel as unknown as Model<IHealthMetricsDocument>,_healthMetricsmapper);
  }

  async save(metrics: HealthMetricsEntity): Promise<void> {
    const data = this.mapper.toMongo(metrics);
        await HealthMetricsModel.create(data);
  }

  async findByUserId(userId: string): Promise<HealthMetricsEntity | null> {
    const doc = await HealthMetricsModel.findOne({ 
      user_id: new Types.ObjectId(userId) 
    }).lean<IHealthMetricsDocument>();

    return doc ? this.mapper.toEntity(doc) : null;
  }

  async findById(id: string): Promise<HealthMetricsEntity | null> {
    const doc = await HealthMetricsModel.findById(id).lean<IHealthMetricsDocument>();
    return doc ? this.mapper.toEntity(doc) : null;
  }
}