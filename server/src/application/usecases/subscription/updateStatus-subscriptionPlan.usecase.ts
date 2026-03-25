import { UpdateSubscriptionPlanStatusRequestDTO } from "@/application/dto/subscription/request/updateStatus-subscriptionPlan.dto";
import { UpdateSubscriptionPlanStatusResponseDTO } from "@/application/dto/subscription/response/updateStatus-subscriptionPlan.dto";
import { IBaseUseCase } from "@/application/interfaces/base-usecase.interface";
import { SUBSCRIPTION_MESSAGES } from "@/domain/constants/messages.constants";
import { ISubscriptionPlanRepository } from "@/domain/interfaces/repositories/subscriptionPlan.repository";



export class UpdateSubscriptionPlanStatusUseCase implements IBaseUseCase<UpdateSubscriptionPlanStatusRequestDTO,UpdateSubscriptionPlanStatusResponseDTO>{
    constructor(
    private readonly _SubscriptionRepository:ISubscriptionPlanRepository

    ){}
    async execute(dto: UpdateSubscriptionPlanStatusRequestDTO): Promise<UpdateSubscriptionPlanStatusResponseDTO> {
        const subscription = await this._SubscriptionRepository.findById(dto.id);
        if(!subscription){
            throw new Error(SUBSCRIPTION_MESSAGES.SUBSCRIPTION_NOT_FOUND);
        }
        subscription.toggleStatus();
        await this._SubscriptionRepository.updataStatus(dto.id,subscription.status);
        return new UpdateSubscriptionPlanStatusResponseDTO({
            message:SUBSCRIPTION_MESSAGES.SUBSCRIPTION_PLAN_STATUS_UPDATED
        });
    }

}