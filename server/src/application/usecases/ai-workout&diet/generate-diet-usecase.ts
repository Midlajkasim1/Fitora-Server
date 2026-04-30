import { GenerateDietRequestDTO } from "@/application/dto/ai-workout&diet/request/generate-diet-plan.dto";
import { GenerateDietResponseDTO } from "@/application/dto/ai-workout&diet/response/generate-diet-plan.dto";
import { IBaseUseCase } from "@/application/interfaces/base-usecase.interface";
import { AI_MESSAGES, ONE_WEEK_IN_SECONDS } from "@/domain/constants/messages.constants";
import { AiDietPlanEntity } from "@/domain/entities/ai-workout&diet/ai-diet-plan.entity";
import { IAiDietPlanRepository } from "@/domain/interfaces/repositories/ai-diet-plan.repository";
import { IHealthMetricsRepository } from "@/domain/interfaces/repositories/onboarding/iclient-health-metrics.interface";
import { IClientPreferenceRepository } from "@/domain/interfaces/repositories/onboarding/iclient.repository";
import { ISubscriptionRepository } from "@/domain/interfaces/repositories/subscription.repository";
import { ISubscriptionPlanRepository } from "@/domain/interfaces/repositories/subscriptionPlan.repository";
import { IAiService, IUserDietMetrics } from "@/domain/interfaces/services/ai-generate.service.interface";
import { ICacheService } from "@/domain/interfaces/services/cache-service";


export class GenerateDietPlanUseCase implements IBaseUseCase<GenerateDietRequestDTO, GenerateDietResponseDTO> {
  constructor(
    private readonly _subRepo: ISubscriptionRepository,
    private readonly _planRepo: ISubscriptionPlanRepository,
    private readonly _aiService: IAiService,
    private readonly _aiDietRepo: IAiDietPlanRepository,
    private readonly _prefRepo: IClientPreferenceRepository,
    private readonly _healthRepo: IHealthMetricsRepository,
    private readonly _cacheService: ICacheService
  ) { }

  async execute(dto: GenerateDietRequestDTO): Promise<GenerateDietResponseDTO> {
 const { userId } = dto;
    const cacheKey = `diet_plan:${userId}`;

    const activeSub = await this._subRepo.findActiveByUserId(userId);
    
    if (!activeSub) {
      throw new Error(AI_MESSAGES.PRO_FEATURE);
    }

    const plan = await this._planRepo.findById(activeSub.planId);
    if (!plan || !plan.hasAiDiet) {
      throw new Error(AI_MESSAGES.UPGRADE_PRO);
    }

    const cached = await this._cacheService.get<AiDietPlanEntity>(cacheKey);
    if (cached &&  cached.weeklyPlan && cached.weeklyPlan.length >0) {
      return {
        success: true,
        message: AI_MESSAGES.LOADING_EXISTING, 
        planId: cached.id || "",
        title: cached.title,
        weeklyPlan: cached.weeklyPlan
      };
    }

    const lockAcquired = await this._cacheService.acquireLock(cacheKey, 60);
    if (!lockAcquired) {
      throw new Error(AI_MESSAGES.BUILDING_PLAN);
    }

    try {
      const prefs = await this._prefRepo.findByUserId(userId);
      if (!prefs) throw new Error(AI_MESSAGES.COMPLETE_NUTRITION);

      const dbMetrics = await this._healthRepo.findByUserId(userId);
      if (!dbMetrics) throw new Error(AI_MESSAGES.ADD_HEIGHT_WEIGHT);

      const startOfToday = new Date();
      startOfToday.setHours(0, 0, 0, 0);
      const generatedToday = await this._aiDietRepo.count({ 
        userId, 
        createdAt: { $gte: startOfToday } 
      });
      
      if (generatedToday >= 2) {
        throw new Error(AI_MESSAGES.DAILY_LIMIT);
      }

      const aiMetrics: IUserDietMetrics = {
        weight: dbMetrics.weight,
        height: dbMetrics.height,
        targetWeight: dbMetrics.targetWeight,
        goal: dbMetrics.primaryGoal,
        preference: prefs.dietPreference || "No preference",
        limitations: prefs.medicalConditions || []
      };

      const generatedEntity = await this._aiService.generateDietPlan(userId, aiMetrics);
      const savedPlan = await this._aiDietRepo.create(generatedEntity);

      await this._cacheService.set(cacheKey, savedPlan, ONE_WEEK_IN_SECONDS);

      return {
        success: true,
        message: AI_MESSAGES.DIET_CREATED,
        planId: savedPlan.id || "",
        title: savedPlan.title,
        weeklyPlan: savedPlan.weeklyPlan
      };

    } finally {
      await this._cacheService.releaseLock(cacheKey);
    }
  }
}