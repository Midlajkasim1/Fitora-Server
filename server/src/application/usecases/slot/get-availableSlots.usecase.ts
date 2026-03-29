import { AvailableSlotResponseDTO } from "@/application/dto/slot/response/get-slots.dto";
import { IBaseUseCase } from "@/application/interfaces/base-usecase.interface";
import { SessionType } from "@/domain/constants/session.constants";
import { PlanSessionType } from "@/domain/constants/subscription.constants";
import { IClientPreferenceRepository } from "@/domain/interfaces/repositories/onboarding/iclient.repository";
import { ITrainerRepository } from "@/domain/interfaces/repositories/onboarding/itrainer.repository";
import { ISlotRepository } from "@/domain/interfaces/repositories/slot.repository";
import { ISubscriptionRepository } from "@/domain/interfaces/repositories/subscription.repository";
import { ISubscriptionPlanRepository } from "@/domain/interfaces/repositories/subscriptionPlan.repository";


export class GetAvailableSlotsUseCase implements IBaseUseCase<string,AvailableSlotResponseDTO[]>{
    constructor(
        private readonly _slotRepository:ISlotRepository,
        private readonly _ClientPreferenceRepository:IClientPreferenceRepository,
        private readonly _trainerRepository:ITrainerRepository,
        private readonly _subscriptionPlanRepository:ISubscriptionPlanRepository,
        private readonly _subscriptionRepository:ISubscriptionRepository
       
    ){}
 async execute(userId: string): Promise<AvailableSlotResponseDTO[]> {
    const activesub = await this._subscriptionRepository.findActiveByUserId(userId);
    if(!activesub){
        return [];
    }
    const plan = await this._subscriptionPlanRepository.findById(activesub.planId);
    if(!plan){
        return [];
    }

     const preference = await this._ClientPreferenceRepository.findByUserId(userId);
     if(!preference || !preference.preferredWorkouts.length){
        return [] ;
     }
     const matchingTrainerIds = await this._trainerRepository.findTrainerIdsBySpecializations(preference.preferredWorkouts);
     if(!matchingTrainerIds || matchingTrainerIds.length === 0){
        return [];
     }
     const aslots = await this._slotRepository.findAvailableSlotsByTrainers(matchingTrainerIds);
     const filterSlots = aslots.filter(slot=>{
        if(plan.sessionType == PlanSessionType.ONE_ON_ONE){
            return slot.type === SessionType.ONE_ON_ONE;
        };
        if(plan.sessionType === PlanSessionType.GROUP){
            return slot.type === SessionType.GROUP;
        }
        return false;
       
     });
     return  filterSlots.map((slot)=>({
        id: slot.id,
      trainerId: slot.trainerId,
      trainerName: slot.trainerName,
      startTime: slot.startTime,
      endTime: slot.endTime,
      type: slot.type,
      capacity: slot.capacity,
      availableSeats: slot.capacity - slot.participants.length,
      status: slot.status,
     }));
 }
}