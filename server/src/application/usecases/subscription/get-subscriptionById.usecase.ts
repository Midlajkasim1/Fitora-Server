import { GetSubscriptionByIdRequestDTO } from "@/application/dto/subscription/request/get-subscriptionById.dto";
import { GetSubscriptionByIdResponseDTO } from "@/application/dto/subscription/response/get-subscriptionById.dto";
import { IBaseUseCase } from "@/application/interfaces/base-usecase.interface";
import { SUBSCRIPTION_MESSAGES } from "@/domain/constants/messages.constants";
import { ISubscriptionRepository } from "@/domain/interfaces/repositories/subscription.repository";



export class GetSubscriptionByIdUseCase implements IBaseUseCase<GetSubscriptionByIdRequestDTO,GetSubscriptionByIdResponseDTO>{
    constructor(
        private readonly _subscriptionRepository:ISubscriptionRepository
    ){}
    async execute(dto: GetSubscriptionByIdRequestDTO): Promise<GetSubscriptionByIdResponseDTO> {
        const subscription = await this._subscriptionRepository.findById(dto.id);
        if(!subscription){
            throw new Error(SUBSCRIPTION_MESSAGES.SUBSCRIPTION_NOT_FOUND);
        }
        return {
            id:subscription.id!,
            name:subscription.name,
            price:subscription.price,
            billingCycle:subscription.billingCycle,
            description:subscription.description,
            status:subscription.status,
            createdAt:subscription.createdAt!
        };
    }
}