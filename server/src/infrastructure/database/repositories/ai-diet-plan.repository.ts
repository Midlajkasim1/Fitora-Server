import { AiDietPlanEntity } from "@/domain/entities/ai-workout&diet/ai-diet-plan";
import { IDietPlanDocument } from "../interfaces/ai-diet-plan.document";
import { AiDietPlanMapper } from "../mappers/ai-diet-plan.mapper";
import { BaseRepository } from "./base.repository"; // Adjust path to your BaseRepository
import { IAiDietPlanRepository } from "@/domain/interfaces/repositories/ai-diet-plan.repository";
import { DietPlanModel } from "../models/ai-diet.model";

export class AiDietPlanRepository extends BaseRepository<AiDietPlanEntity, IDietPlanDocument> implements IAiDietPlanRepository {
  constructor(
    private readonly _aiDietPlanMapper:AiDietPlanMapper
  ) {
    super(DietPlanModel, _aiDietPlanMapper);
  }

  async findByUserId(userId: string): Promise<AiDietPlanEntity[]> {
    const docs = await DietPlanModel.find({ userId }).sort({ createdAt: -1 }).exec();
    return docs.map(doc => this._aiDietPlanMapper.toEntity(doc));
  }

  async findLatestByUserId(userId: string): Promise<AiDietPlanEntity | null> {
    const doc = await DietPlanModel.findOne({ userId }).sort({ createdAt: -1 }).exec();
    return doc ? this._aiDietPlanMapper.toEntity(doc) : null;
  }
}