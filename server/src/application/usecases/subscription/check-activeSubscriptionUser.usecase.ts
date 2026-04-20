import { CheckActiveSubscriptionRequestDTO } from "@/application/dto/subscription/request/check-active-subscriptionUser.dto";
import { ActiveSubscriptionResponseDTO } from "@/application/dto/subscription/response/check-active-subscriptionUser.dto";
import { IBaseUseCase } from "@/application/interfaces/base-usecase.interface";
import { ISubscriptionRepository } from "@/domain/interfaces/repositories/subscription.repository";
import { ISubscriptionPlanRepository } from "@/domain/interfaces/repositories/subscriptionPlan.repository";



export class CheckActiveSubscriptionUserUseCase implements IBaseUseCase<CheckActiveSubscriptionRequestDTO,ActiveSubscriptionResponseDTO>{
    constructor(
        private readonly _subscriptionRepository:ISubscriptionRepository,
        private readonly _subscriptionPlanRepository:ISubscriptionPlanRepository
    ){}
    async execute(dto: CheckActiveSubscriptionRequestDTO): Promise<ActiveSubscriptionResponseDTO> {
        
        const activesub= await this._subscriptionRepository.findActiveByUserId(dto.userId);
        if(!activesub){
            return new ActiveSubscriptionResponseDTO({
                isPremium:false,
                subscription:null
            });
        }
        const plan = await this._subscriptionPlanRepository.findById(activesub.planId);
        return new ActiveSubscriptionResponseDTO({
            isPremium: true,
            subscription: {
                id: activesub.id!,
                planId: activesub.planId,
                planName: plan?.name || "Plan",
                endDate: activesub.endDate,
                status: activesub.status,
                hasAiWorkout: plan?.hasAiWorkout || false,
                hasAiDiet: plan?.hasAiDiet || false
            }
    });
};
}