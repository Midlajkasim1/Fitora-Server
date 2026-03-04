import { GetSubscriptionRequestDTO } from "@/application/dto/subscription/request/get-subscription.dto";
import { GetSubscriptionResponseDTO } from "@/application/dto/subscription/response/get-subscription.dto";
import { IBaseUseCase } from "@/application/interfaces/base-usecase.interface";
import { ISubscriptionRepository } from "@/domain/interfaces/repositories/subscription.repository";



export class GetSubcriptionUseCase implements IBaseUseCase<GetSubscriptionRequestDTO,GetSubscriptionResponseDTO>{
    constructor(
        private readonly _subscriptionRepository:ISubscriptionRepository
    ){}
    async execute(dto: GetSubscriptionRequestDTO): Promise<GetSubscriptionResponseDTO> {
        const {subscriptions,totals}= await this._subscriptionRepository.findAll(dto);
        return {
            subscriptions:subscriptions.map(sub=>({
                id:sub.id!,
                name:sub.name,
                price:sub.price,
                billingCycle:sub.billingCycle,
                status:sub.status,
                createdAt:sub.createdAt!,
                totalPurchaseUser:sub.totalPurchaseUser ?? 0
            })),
            totals
        };

    }
}