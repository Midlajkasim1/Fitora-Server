import { UpdateSubscriptionStatusRequestDTO } from "@/application/dto/subscription/request/updateStatus-subscription.dto";
import { UpdateSubscriptionStatusResponseDTO } from "@/application/dto/subscription/response/updateStatus-subscription.dto";
import { IBaseUseCase } from "@/application/interfaces/base-usecase.interface";
import { SUBSCRIPTION_MESSAGES } from "@/domain/constants/messages.constants";
import { ISubscriptionRepository } from "@/domain/interfaces/repositories/subscription.repository";



export class UpdateSubscriptionStatusUseCase implements IBaseUseCase<UpdateSubscriptionStatusRequestDTO,UpdateSubscriptionStatusResponseDTO>{
    constructor(
    private readonly _SubscriptionRepository:ISubscriptionRepository

    ){}
    async execute(dto: UpdateSubscriptionStatusRequestDTO): Promise<UpdateSubscriptionStatusResponseDTO> {
        const subscription = await this._SubscriptionRepository.findById(dto.id);
        if(!subscription){
            throw new Error(SUBSCRIPTION_MESSAGES.SUBSCRIPTION_NOT_FOUND);
        }
        subscription.toggleStatus();
        await this._SubscriptionRepository.updataStatus(dto.id,subscription.status);
        return {
            message:SUBSCRIPTION_MESSAGES.SUBSCRIPTION_PLAN_STATUS_UPDATED
        };
    }

}