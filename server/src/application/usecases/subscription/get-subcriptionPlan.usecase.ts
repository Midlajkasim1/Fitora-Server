import { GetSubscriptionPlanRequestDTO } from "@/application/dto/subscription/request/get-subscriptionPlan.dto";
import { GetSubscriptionPlanResponseDTO } from "@/application/dto/subscription/response/get-subscriptionPlan.dto";
import { SubscriptionPlanManagementListDTO } from "@/application/dto/subscription/response/subscriptionManagementPlan.dto";
import { IBaseUseCase } from "@/application/interfaces/base-usecase.interface";
import { ISubscriptionPlanRepository } from "@/domain/interfaces/repositories/subscriptionPlan.repository";



export class GetSubcriptionPlanUseCase implements IBaseUseCase<GetSubscriptionPlanRequestDTO,GetSubscriptionPlanResponseDTO>{
    constructor(
        private readonly _subscriptionRepository:ISubscriptionPlanRepository
    ){}
    async execute(dto: GetSubscriptionPlanRequestDTO): Promise<GetSubscriptionPlanResponseDTO> {
        const {data,total}= await this._subscriptionRepository.findAllSPlan(dto);
      const subscriptionItems = data.map(sub => new SubscriptionPlanManagementListDTO({
      id: sub.id!,
      name: sub.name,
      price: Number(sub.price),
      billingCycle: sub.billingCycle,
      description: sub.description,
      status: sub.status,
      createdAt: sub.createdAt!,
      totalPurchaseUser: sub.totalPurchaseUser ?? 0
    }));

    return new GetSubscriptionPlanResponseDTO({
      subscriptions: subscriptionItems,
      totals:total
    });

    }
}