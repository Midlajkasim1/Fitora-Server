import { GetSubscriptionPlanRequestDTO } from "@/application/dto/subscription/request/get-subscriptionPlan.dto";
import { GetSubscriptionPlanResponseDTO } from "@/application/dto/subscription/response/get-subscriptionPlan.dto";
import { IBaseUseCase } from "@/application/interfaces/base-usecase.interface";
import { ISubscriptionPlanRepository } from "@/domain/interfaces/repositories/subscriptionPlan.repository";



export class GetSubcriptionPlanUseCase implements IBaseUseCase<GetSubscriptionPlanRequestDTO,GetSubscriptionPlanResponseDTO>{
    constructor(
        private readonly _subscriptionRepository:ISubscriptionPlanRepository
    ){}
    async execute(dto: GetSubscriptionPlanRequestDTO): Promise<GetSubscriptionPlanResponseDTO> {
        const {subscriptions,totals}= await this._subscriptionRepository.findAll(dto);
        return {
            subscriptions:subscriptions.map(sub=>({
                id:sub.id!,
                name:sub.name,
                price:sub.price,
                billingCycle:sub.billingCycle,
                description:sub.description,
                status:sub.status,
                createdAt:sub.createdAt!,
                totalPurchaseUser:sub.totalPurchaseUser ?? 0
            })),
            totals
        };

    }
}