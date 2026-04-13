import { GetSubscriptionPlanByIdRequestDTO } from "@/application/dto/subscription/request/get-subscriptionByIdPlan.dto";
import { GetSubscriptionPlanByIdResponseDTO } from "@/application/dto/subscription/response/get-subscriptionById.dto";
import { IBaseUseCase } from "@/application/interfaces/base-usecase.interface";
import { SUBSCRIPTION_MESSAGES } from "@/domain/constants/messages.constants";
import { ISubscriptionPlanRepository } from "@/domain/interfaces/repositories/subscriptionPlan.repository";



export class GetSubscriptionPlanByIdUseCase implements IBaseUseCase<GetSubscriptionPlanByIdRequestDTO,GetSubscriptionPlanByIdResponseDTO>{
    constructor(
        private readonly _subscriptionRepository:ISubscriptionPlanRepository
    ){}
    async execute(dto: GetSubscriptionPlanByIdRequestDTO): Promise<GetSubscriptionPlanByIdResponseDTO> {
        const subscription = await this._subscriptionRepository.findById(dto.id);
        if(!subscription){
            throw new Error(SUBSCRIPTION_MESSAGES.SUBSCRIPTION_NOT_FOUND);
        }
        return new GetSubscriptionPlanByIdResponseDTO({
            id:subscription.id!,
            name:subscription.name,
            price:Number(subscription.price),
            billingCycle:subscription.billingCycle,
            description:subscription.description,
            status:subscription.status,
            sessionType:subscription.sessionType,
            sessionCredits:subscription.sessionCredits,
            hasAiWorkout:subscription.hasAiWorkout,
            hasAiDiet:subscription.hasAiDiet,
            createdAt:subscription.createdAt!
        });
    }
}