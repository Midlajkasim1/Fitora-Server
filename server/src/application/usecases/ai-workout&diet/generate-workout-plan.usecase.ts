import { GenerateWorkoutRequestDTO } from "@/application/dto/ai-workout&diet/request/generate-plan.request.dto";
import { GenerateWorkoutResponseDTO } from "@/application/dto/ai-workout&diet/response/generate-plan.dto";
import { IBaseUseCase } from "@/application/interfaces/base-usecase.interface";
import { IAiWorkoutPlanRepository } from "@/domain/interfaces/repositories/ai-workout-plan.repository";
import { IClientPreferenceRepository } from "@/domain/interfaces/repositories/onboarding/iclient.repository";
import { ISpecialization } from "@/domain/interfaces/repositories/specialization.interface";
import { ISubscriptionRepository } from "@/domain/interfaces/repositories/subscription.repository";
import { ISubscriptionPlanRepository } from "@/domain/interfaces/repositories/subscriptionPlan.repository";
import { IAiService } from "@/domain/interfaces/services/ai-generate.service.interface";


export class GenerateWorkoutPlanUseCase implements IBaseUseCase<GenerateWorkoutRequestDTO, GenerateWorkoutResponseDTO> {
    constructor(
    private readonly _subRepo: ISubscriptionRepository,
    private readonly _planRepo: ISubscriptionPlanRepository,
    private readonly _aiService: IAiService,
    private readonly _aiWorkoutRepo: IAiWorkoutPlanRepository,
    private readonly _preferenceRepo: IClientPreferenceRepository, 
    private readonly _specializationRepo: ISpecialization 
  ) {}

  async execute(dto: GenerateWorkoutRequestDTO): Promise<GenerateWorkoutResponseDTO> {
 const prefs = await this._preferenceRepo.findByUserId(dto.userId);
    if (!prefs || !prefs.preferredWorkouts) {
      throw new Error("Please complete your fitness profile and choose a specialization first.");
    }

    const specialization = await this._specializationRepo.findById(prefs.preferredWorkouts);
    const specName = specialization ? specialization.name : "General Fitness";

    const activeSub = await this._subRepo.findActiveByUserId(dto.userId);
    
    if (!activeSub) {
      const totalGenerated = await this._aiWorkoutRepo.count({ userId: dto.userId });
      if (totalGenerated >= 3) {
        throw new Error("Free limit reached. You can only generate 3 workout plans. Please subscribe for unlimited access!");
      }
    } else {
      const plan = await this._planRepo.findById(activeSub.planId);
      if (plan && plan.aiWorkoutLimit !== -1) {
        const currentUsage = await this._aiWorkoutRepo.count({ 
            userId: dto.userId,
            createdAt: { $gte: activeSub.startDate } 
        });
        if (currentUsage >= plan.aiWorkoutLimit) {
            throw new Error("Monthly AI limit reached for your current plan.");
        }
      }
    }

    const aiMetrics = {
      ...dto.metrics,
      goal: `${dto.metrics.goal} (Focus: ${specName})`,
      level: prefs.experienceLevel || dto.metrics.level
    };

    const generatedEntity = await this._aiService.generateWorkoutPlan(dto.userId, aiMetrics);

    const savedPlan = await this._aiWorkoutRepo.create(generatedEntity);

    return {
      success: true,
      message: `New ${specName} workout plan generated successfully!`,
      planId: savedPlan.id,
      title: savedPlan.title,
      weeklyPlan: savedPlan.weeklyPlan
    };
    }
}