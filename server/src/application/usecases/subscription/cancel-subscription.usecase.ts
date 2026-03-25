import { CancelSubscriptionRequestDTO } from "@/application/dto/subscription/request/cancel-subscription.dto";
import { CancelSubscriptionResponseDTO } from "@/application/dto/subscription/response/cancel-subscription.dto";
import { IBaseUseCase } from "@/application/interfaces/base-usecase.interface";
import { SUBSCRIPTION_MESSAGES } from "@/domain/constants/messages.constants";
import { SubscriptionStatus } from "@/domain/constants/subscription.constants";
import { ISubscriptionRepository } from "@/domain/interfaces/repositories/subscription.repository";



export class CancelSubscriptionUseCase implements IBaseUseCase<CancelSubscriptionRequestDTO,CancelSubscriptionResponseDTO>{
    constructor(
        private readonly _subscriptionRepository:ISubscriptionRepository
    ){}
    async execute(dto: CancelSubscriptionRequestDTO): Promise<CancelSubscriptionResponseDTO> {
        const activesub = await this._subscriptionRepository.findActiveByUserId(dto.userId);
        if(!activesub){
            throw new Error(SUBSCRIPTION_MESSAGES.SUBSCRIPTION_NOT_FOUND);
        }
        await this._subscriptionRepository.updateStatus(activesub.id!,SubscriptionStatus.CANCELLED);
        return new CancelSubscriptionResponseDTO({
            message:SUBSCRIPTION_MESSAGES.SUBSCRIPTION_CANCELLED
            
        });
    }
}