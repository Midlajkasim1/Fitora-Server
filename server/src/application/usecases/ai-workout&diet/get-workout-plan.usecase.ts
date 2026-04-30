

import { IBaseUseCase } from "@/application/interfaces/base-usecase.interface";
import { GetWorkoutPlanResponseDTO } from "../../dto/ai-workout&diet/response/get-workout-plan.dto";
import { IAiWorkoutPlanRepository } from "@/domain/interfaces/repositories/ai-workout-plan.repository";
import { ICacheService } from "@/domain/interfaces/services/cache-service";
import { AiWorkoutPlanEntity } from "@/domain/entities/ai-workout&diet/ai-workout-plan.entity";
import { AI_MESSAGES, ONE_WEEK_IN_SECONDS } from "@/domain/constants/messages.constants";
import { GetWorkoutPlanRequestDTO } from "@/application/dto/ai-workout&diet/request/get-workoutPlan.dto";

export class GetWorkoutPlanUseCase implements IBaseUseCase<GetWorkoutPlanRequestDTO, GetWorkoutPlanResponseDTO> {
  constructor(
    private readonly _aiWorkoutRepo: IAiWorkoutPlanRepository,
    private readonly _cacheService: ICacheService
  ) {}

  async execute(dto: GetWorkoutPlanRequestDTO): Promise<GetWorkoutPlanResponseDTO> {
    const { userId } = dto;
    const cacheKey = `workout:${userId}`;

    const cachedData = await this._cacheService.get<AiWorkoutPlanEntity>(cacheKey);
    if (cachedData && cachedData.weeklyPlan?.length > 0) {
      return this._formatResponse(cachedData, AI_MESSAGES.RETRIEVED_FROM_CACHE);
    }

    const dbPlan = await this._aiWorkoutRepo.findLatestByUserId(userId);
    if (dbPlan) {
      await this._cacheService.set(cacheKey, dbPlan, ONE_WEEK_IN_SECONDS);
      return this._formatResponse(dbPlan, AI_MESSAGES.RETRIEVED_FROM_DB);
    }

    return {
      success: false,
      message: AI_MESSAGES.NO_WORKOUT_PLAN,
      planId: "",
      title: "",
      weeklyPlan: []
    };
  }

  private _formatResponse(plan: AiWorkoutPlanEntity, message: string): GetWorkoutPlanResponseDTO {
    return {
      success: true,
      message,
      planId: plan.id || "",
      title: plan.title,
      weeklyPlan: plan.weeklyPlan
    };
  }
}