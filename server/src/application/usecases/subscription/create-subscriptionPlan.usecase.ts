import { CreateSubscriptionPlanRequestDTO } from "@/application/dto/subscription/request/create-subscriptionPlan.dto";
import { CreateSubscriptionPlanResponseDTO } from "@/application/dto/subscription/response/create-subscriptionPlan.dto";
import { IBaseUseCase } from "@/application/interfaces/base-usecase.interface";
import { SUBSCRIPTION_MESSAGES } from "@/domain/constants/messages.constants";
import { SubscriptionPlanEntity } from "@/domain/entities/subscription/subscriptionplan.entity";
import { ISubscriptionPlanRepository } from "@/domain/interfaces/repositories/subscriptionPlan.repository";


export class CreateSubscriptionPlanUseCase implements IBaseUseCase<CreateSubscriptionPlanRequestDTO,CreateSubscriptionPlanResponseDTO>{
    constructor(
        private readonly _subscriptionRepository:ISubscriptionPlanRepository
    ){}
    async execute(dto: CreateSubscriptionPlanRequestDTO): Promise<CreateSubscriptionPlanResponseDTO> {
    const existingSub = await this._subscriptionRepository.findByName(dto.name);
    if(existingSub){
        throw new Error(SUBSCRIPTION_MESSAGES.SUBSCRIPTION_ALREADY_EXISTS);
    }    
    const subscription = SubscriptionPlanEntity.create({
        name:dto.name,
        price:dto.price,
        billingCycle:dto.billingCycle,
        description:dto.description,
        sessionType:dto.sessionType,
        sessionCredits:dto.sessionCredits,
        hasAiWorkout:dto.hasAiWorkout,
        hasAiDiet:dto.hasAiDiet

    });
       await this._subscriptionRepository.create(subscription);
    return new CreateSubscriptionPlanResponseDTO({
        message:SUBSCRIPTION_MESSAGES.SUBSCRIPTION_PLAN_CREATED
    });

    }
}