

import { IBaseUseCase } from "@/application/interfaces/base-usecase.interface";
import { GetWorkoutPlanResponseDTO } from "../../dto/ai-workout&diet/response/get-workout-plan.dto";
import { IAiWorkoutPlanRepository } from "@/domain/interfaces/repositories/ai-workout-plan.repository";
import { ICacheService } from "@/domain/interfaces/services/cache-service";
import { AiWorkoutPlanEntity } from "@/domain/entities/ai-workout&diet/ai-workout-plan.entity";
import { ONE_WEEK_IN_SECONDS } from "@/domain/constants/messages.constants";
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
      return this._formatResponse(cachedData, "Retrieved from neural cache.");
    }

    const dbPlan = await this._aiWorkoutRepo.findLatestByUserId(userId);
    if (dbPlan) {
      await this._cacheService.set(cacheKey, dbPlan, ONE_WEEK_IN_SECONDS);
      return this._formatResponse(dbPlan, "Retrieved from database.");
    }

    return {
      success: false,
      message: "No active workout plan found. Please initialize generation.",
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