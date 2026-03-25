import { UpdateSubscriptionPlanRequestDTO } from "@/application/dto/subscription/request/update-subscriptionPlan.dto";
import { UpdateSubscriptionPlanResponseDTO } from "@/application/dto/subscription/response/update-subscriptionPlan.dto";
import { IBaseUseCase } from "@/application/interfaces/base-usecase.interface";
import { SUBSCRIPTION_MESSAGES } from "@/domain/constants/messages.constants";
import { SubscriptionPlanEntity } from "@/domain/entities/subscription/subscriptionplan.entity";
import { ISubscriptionPlanRepository } from "@/domain/interfaces/repositories/subscriptionPlan.repository";



export class UpdateSubscriptionPlanUseCase implements IBaseUseCase<UpdateSubscriptionPlanRequestDTO,UpdateSubscriptionPlanResponseDTO>{
    constructor(
        private readonly _subscriptionRepository:ISubscriptionPlanRepository
    ){}
    async execute(dto: UpdateSubscriptionPlanRequestDTO): Promise<UpdateSubscriptionPlanResponseDTO> {
        const existing = await this._subscriptionRepository.findById(dto.id);
        if(!existing){
            throw new Error(SUBSCRIPTION_MESSAGES.SUBSCRIPTION_NOT_FOUND);
        }
        if(dto.name && dto.name !==existing.name){
            const duplicate = await this._subscriptionRepository.findByName(dto.name);
            if(duplicate){
                throw new Error(SUBSCRIPTION_MESSAGES.SUBSCRIPTION_ALREADY_EXISTS);
            }
        }
        const updateData: Partial<SubscriptionPlanEntity> = {
      name: dto.name,
      price: dto.price,
      billingCycle: dto.billingCycle,
      description: dto.description,
      sessionType: dto.sessionType,
      sessionCredits: dto.sessionCredits,
      aiWorkoutLimit: dto.aiWorkoutLimit,
      aiDietLimit: dto.aiDietLimit,
    };
      await this._subscriptionRepository.update!(dto.id,updateData);
      return new UpdateSubscriptionPlanResponseDTO({
        message:SUBSCRIPTION_MESSAGES.SUBSCRIPTION_PLAN_UPDATED
      });
    }
}