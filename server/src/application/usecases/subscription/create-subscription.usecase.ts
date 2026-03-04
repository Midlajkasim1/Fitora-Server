import { CreateSubscriptionRequestDTO } from "@/application/dto/subscription/request/create-subscription.dto";
import { CreateSubscriptionResponseDTO } from "@/application/dto/subscription/response/create-subscription.dto";
import { IBaseUseCase } from "@/application/interfaces/base-usecase.interface";
import { SUBSCRIPTION_MESSAGES } from "@/domain/constants/messages.constants";
import { SubscriptionEntity } from "@/domain/entities/subscription/subscription.entity";
import { ISubscriptionRepository } from "@/domain/interfaces/repositories/subscription.repository";


export class CreateSubscriptionUseCase implements IBaseUseCase<CreateSubscriptionRequestDTO,CreateSubscriptionResponseDTO>{
    constructor(
        private readonly _subscriptionRepository:ISubscriptionRepository
    ){}
    async execute(dto: CreateSubscriptionRequestDTO): Promise<CreateSubscriptionResponseDTO> {
    const existingSub = await this._subscriptionRepository.findByName(dto.name);
    if(existingSub){
        throw new Error(SUBSCRIPTION_MESSAGES.SUBSCRIPTION_ALREADY_EXISTS);
    }    
    const subscription = SubscriptionEntity.create({
        name:dto.name,
        price:dto.price,
        billingCycle:dto.billingCycle,
        description:dto.description


    });
       await this._subscriptionRepository.create(subscription);
    return {
        message:SUBSCRIPTION_MESSAGES.SUBSCRIPTION_PLAN_CREATED
    };

    }
}