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
        const updatedSubscription = SubscriptionPlanEntity.create({
            id:existing.id!,
            name:dto.name || existing.name,
            price:dto.price || existing.price,
            billingCycle:dto.billingCycle || existing.billingCycle,
            description:dto.description || existing.description,
            sessionType:dto.sessionType || existing.sessionType,
            sessionCredits:dto.sessionCredits || existing.sessionCredits,
            aiWorkoutLimit:dto.aiWorkoutLimit || existing.aiWorkoutLimit,
            aiDietLimit:dto.aiDietLimit || existing.aiDietLimit

        });
      await this._subscriptionRepository.update(updatedSubscription);
      return{
        message:SUBSCRIPTION_MESSAGES.SUBSCRIPTION_PLAN_UPDATED
      };
    }
}