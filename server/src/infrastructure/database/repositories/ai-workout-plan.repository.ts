import { AiWorkoutPlanEntity } from "@/domain/entities/ai-workout&diet/ai-workout-plan.entity";
import { AiWorkoutPlanMapper } from "../mappers/ai-workout-plan.mapper";
import { BaseRepository } from "./base.repository"; // Adjust path to your BaseRepository
import { IWorkoutPlanDocument } from "../interfaces/ai-workout-plan.document";
import { WorkoutPlanModel } from "../models/ai-workout.model";
import { IAiWorkoutPlanRepository } from "@/domain/interfaces/repositories/ai-workout-plan.repository";

export class AiWorkoutPlanRepository extends BaseRepository<AiWorkoutPlanEntity, IWorkoutPlanDocument> implements IAiWorkoutPlanRepository {
  constructor(
    private readonly _aiWorkoutMapper:AiWorkoutPlanMapper
  ) {
    super(WorkoutPlanModel, _aiWorkoutMapper);
  }

  async findByUserId(userId: string): Promise<AiWorkoutPlanEntity[]> {
    const docs = await WorkoutPlanModel.find({ userId }).sort({ createdAt: -1 }).exec();
    return docs.map(doc => this._aiWorkoutMapper.toEntity(doc));
  }

  async findLatestByUserId(userId: string): Promise<AiWorkoutPlanEntity | null> {
    const doc = await WorkoutPlanModel.findOne({ userId }).sort({ createdAt: -1 }).exec();
    return doc ? this._aiWorkoutMapper.toEntity(doc) : null;
  }
}