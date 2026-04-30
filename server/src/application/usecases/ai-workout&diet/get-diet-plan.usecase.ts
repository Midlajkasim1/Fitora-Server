// application/usecases/ai-workout&diet/get-diet-plan.usecase.ts

import { IBaseUseCase } from "@/application/interfaces/base-usecase.interface";
import { GetDietPlanResponseDTO } from "../../dto/ai-workout&diet/response/get-diet-plan.dto";
import { IAiDietPlanRepository } from "@/domain/interfaces/repositories/ai-diet-plan.repository";
import { ICacheService } from "@/domain/interfaces/services/cache-service";
import { AiDietPlanEntity } from "@/domain/entities/ai-workout&diet/ai-diet-plan.entity";
import { AI_MESSAGES, ONE_WEEK_IN_SECONDS } from "@/domain/constants/messages.constants";
import { GetDietPlanRequestDTO } from "@/application/dto/ai-workout&diet/request/get-diet-plan.dto";

export class GetDietPlanUseCase implements IBaseUseCase<GetDietPlanRequestDTO, GetDietPlanResponseDTO> {
  constructor(
    private readonly _aiDietRepo: IAiDietPlanRepository,
    private readonly _cacheService: ICacheService
  ) {}

  async execute(dto: GetDietPlanRequestDTO): Promise<GetDietPlanResponseDTO> {
    const { userId } = dto;
    const cacheKey = `diet_plan:${userId}`;

    const cachedData = await this._cacheService.get<AiDietPlanEntity>(cacheKey);
    if (cachedData && cachedData.weeklyPlan?.length > 0) {
     return this._formatResponse(cachedData, AI_MESSAGES.MEAL_PLAN_READY);  
      }

    const dbPlan = await this._aiDietRepo.findLatestByUserId(userId);
    if (dbPlan) {
      await this._cacheService.set(cacheKey, dbPlan, ONE_WEEK_IN_SECONDS);
    return this._formatResponse(dbPlan, AI_MESSAGES.MEAL_PLAN_READY);    }

    return {
      success: false,
      message: AI_MESSAGES.NO_DIET_PLAN,
      planId: "",
      title: "",
      weeklyPlan: []
    };
  }

  private _formatResponse(plan: AiDietPlanEntity, message: string): GetDietPlanResponseDTO {
    return {
      success: true,
      message,
      planId: plan.id || "",
      title: plan.title,
      weeklyPlan: plan.weeklyPlan
    };
  }
}