import { GenerateWorkoutRequestDTO } from "@/application/dto/ai-workout&diet/request/generate-plan.request.dto";
import { GenerateWorkoutResponseDTO } from "@/application/dto/ai-workout&diet/response/generate-plan.dto";
import { IBaseUseCase } from "@/application/interfaces/base-usecase.interface";
import { ONE_WEEK_IN_SECONDS } from "@/domain/constants/messages.constants";
import { AiWorkoutPlanEntity } from "@/domain/entities/ai-workout&diet/ai-workout-plan.entity";
import { IAiWorkoutPlanRepository } from "@/domain/interfaces/repositories/ai-workout-plan.repository";
import { IHealthMetricsRepository } from "@/domain/interfaces/repositories/onboarding/iclient-health-metrics.interface";
import { IClientPreferenceRepository } from "@/domain/interfaces/repositories/onboarding/iclient.repository";
import { ISpecialization } from "@/domain/interfaces/repositories/specialization.interface";
import { ISubscriptionRepository } from "@/domain/interfaces/repositories/subscription.repository";
import { ISubscriptionPlanRepository } from "@/domain/interfaces/repositories/subscriptionPlan.repository";
import { IAiService, IUserFitnessMetrics } from "@/domain/interfaces/services/ai-generate.service.interface";
import { ICacheService } from "@/domain/interfaces/services/cache-service";


export class GenerateWorkoutPlanUseCase implements IBaseUseCase<GenerateWorkoutRequestDTO, GenerateWorkoutResponseDTO> {
  constructor(
    private readonly _subRepo: ISubscriptionRepository,
    private readonly _planRepo: ISubscriptionPlanRepository,
    private readonly _aiService: IAiService,
    private readonly _aiWorkoutRepo: IAiWorkoutPlanRepository,
    private readonly _preferenceRepo: IClientPreferenceRepository,
    private readonly _specializationRepo: ISpecialization,
    private readonly _healthRepo: IHealthMetricsRepository,
    private readonly _cacheService: ICacheService
  ) { }

  async execute(dto: GenerateWorkoutRequestDTO): Promise<GenerateWorkoutResponseDTO> {
    const { userId } = dto;
    const cacheKey = `workout:${userId}`;

    const cachedPlan = await this._cacheService.get<AiWorkoutPlanEntity>(cacheKey);
    if (cachedPlan && cachedPlan.weeklyPlan?.length >= 7) {
      return {
        success: true,
        message: "Retrieved from neural cache.",
        planId: cachedPlan.id || "",
        title: cachedPlan.title,
        weeklyPlan: cachedPlan.weeklyPlan
      };
    }

    const hasLock = await this._cacheService.acquireLock(cacheKey, 60);
    if (!hasLock) {
      throw new Error("AI is already processing your plan. Please wait a moment.");
    }

    try {
      const activeSub = await this._subRepo.findActiveByUserId(userId);
      const prefs = await this._preferenceRepo.findByUserId(userId);
      if (!prefs?.preferredWorkouts) throw new Error("Select specialization first.");

      const specialization = await this._specializationRepo.findById(prefs.preferredWorkouts);
      const specName = specialization ? specialization.name : "General Fitness";

      let aiMetrics: IUserFitnessMetrics;

      if (!activeSub) {
        const usage = await this._aiWorkoutRepo.count({ userId });
        if (usage >= 1) throw new Error("Free trial limit reached. Please subscribe!");

        aiMetrics = {
          weight: 0, 
          height: 0,
          goal: `General Fitness (${specName})`,
          level: prefs.experienceLevel || "Beginner",
          equipment: ["No equipment"],
          specializations: specName,
          days: "7"
        };
      } else {
        const plan = await this._planRepo.findById(activeSub.planId);
        if (!plan || !plan.hasAiWorkout) throw new Error("Your current plan does not include AI Workouts.");

        const dbMetrics = await this._healthRepo.findByUserId(userId);
        if (!dbMetrics) throw new Error("Complete profile metrics first to get personalized training.");

        aiMetrics = {
          weight: dbMetrics.weight,
          height: dbMetrics.height,
          goal: `${dbMetrics.primaryGoal} (${specName})`,
          level: prefs.experienceLevel || "Beginner",
          equipment: ["No equipment"],
          specializations: specName,
          days: "7"
        };
      }

      const generatedEntity = await this._aiService.generateWorkoutPlan(userId, aiMetrics);
      const savedPlan = await this._aiWorkoutRepo.create(generatedEntity);

      await this._cacheService.set(cacheKey, savedPlan, ONE_WEEK_IN_SECONDS);

      return {
        success: true,
        message: "Plan generated successfully.",
        planId: savedPlan.id || "",
        title: savedPlan.title,
        weeklyPlan: savedPlan.weeklyPlan
      };

    } finally {
      await this._cacheService.releaseLock(cacheKey);
    }
  }
}