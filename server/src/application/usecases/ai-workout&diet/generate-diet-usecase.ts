import { GenerateDietRequestDTO } from "@/application/dto/ai-workout&diet/request/generate-diet-plan.dto";
import { GenerateDietResponseDTO } from "@/application/dto/ai-workout&diet/response/generate-diet-plan.dto";
import { IBaseUseCase } from "@/application/interfaces/base-usecase.interface";
import { IAiDietPlanRepository } from "@/domain/interfaces/repositories/ai-diet-plan.repository";
import { IClientPreferenceRepository } from "@/domain/interfaces/repositories/onboarding/iclient.repository";
import { ISubscriptionRepository } from "@/domain/interfaces/repositories/subscription.repository";
import { ISubscriptionPlanRepository } from "@/domain/interfaces/repositories/subscriptionPlan.repository";
import { IAiService } from "@/domain/interfaces/services/ai-generate.service.interface";


export class GenerateDietPlanUseCase implements IBaseUseCase<GenerateDietRequestDTO, GenerateDietResponseDTO> {
    constructor(
        private readonly _subRepo: ISubscriptionRepository,
        private readonly _planRepo: ISubscriptionPlanRepository,
        private readonly _aiService: IAiService,
        private readonly _aiDietRepo: IAiDietPlanRepository,
        private readonly _prefRepo: IClientPreferenceRepository
    ) { }
    async execute(dto: GenerateDietRequestDTO ): Promise<GenerateDietResponseDTO> {
        const prefs = await this._prefRepo.findByUserId(dto.userId);
    if (!prefs) {
      throw new Error("Please complete your nutrition profile first.");
    }

    // 2. Check Subscription & Free Limits (3 times)
    const activeSub = await this._subRepo.findActiveByUserId(dto.userId);
    
    if (!activeSub) {
      const totalGenerated = await this._aiDietRepo.count({ userId: dto.userId });
      if (totalGenerated >= 3) {
        throw new Error("Free diet limit reached. Please subscribe for unlimited personalized nutrition!");
      }
    } else {
      const plan = await this._planRepo.findById(activeSub.planId);
      if (plan && plan.aiDietLimit !== -1) {
        const currentUsage = await this._aiDietRepo.count({ 
            userId: dto.userId,
            createdAt: { $gte: activeSub.startDate } 
        });
        if (currentUsage >= plan.aiDietLimit) {
            throw new Error("Monthly AI diet limit reached for your current plan.");
        }
      }
    }

    const aiMetrics = {
      ...dto.metrics,
      preference: prefs.dietPreference || dto.metrics.preference,
      limitations: prefs.medicalConditions || dto.metrics.limitations,
      targetCalories: dto.metrics.targetCalories || 2000 
    };

    // 4. Generate via AI Service
    const generatedEntity = await this._aiService.generateDietPlan(dto.userId, aiMetrics);

    // 5. Save to Repository
    const savedPlan = await this._aiDietRepo.create(generatedEntity);

    return {
      success: true,
      message: "Customized diet plan generated successfully!",
      planId: savedPlan.id,
      title: savedPlan.title,
      weeklyPlan: savedPlan.weeklyPlan
    };
    }
}