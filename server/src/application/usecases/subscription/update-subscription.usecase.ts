import { UpdateSubscriptionRequestDTO } from "@/application/dto/subscription/request/update-subscription.dto";
import { UpdateSubscriptionResponseDTO } from "@/application/dto/subscription/response/update-subscription.dto";
import { IBaseUseCase } from "@/application/interfaces/base-usecase.interface";
import { SUBSCRIPTION_MESSAGES } from "@/domain/constants/messages.constants";
import { SubscriptionEntity } from "@/domain/entities/subscription/subscription.entity";
import { ISubscriptionRepository } from "@/domain/interfaces/repositories/subscription.repository";



export class UpdateSubscriptionUseCase implements IBaseUseCase<UpdateSubscriptionRequestDTO,UpdateSubscriptionResponseDTO>{
    constructor(
        private readonly _subscriptionRepository:ISubscriptionRepository
    ){}
    async execute(dto: UpdateSubscriptionRequestDTO): Promise<UpdateSubscriptionResponseDTO> {
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
        const updatedSubscription = SubscriptionEntity.create({
            id:existing.id!,
            name:dto.name || existing.name,
            price:dto.price || existing.price,
            billingCycle:dto.billingCycle || existing.billingCycle,
            description:dto.description || existing.description

        });
      await this._subscriptionRepository.update(updatedSubscription);
      return{
        message:SUBSCRIPTION_MESSAGES.SUBSCRIPTION_PLAN_UPDATED
      };
    }
}