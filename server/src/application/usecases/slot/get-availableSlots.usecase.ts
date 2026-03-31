import { GetAvailableSlotsRequestDTO } from "@/application/dto/slot/request/get-slots.dto";
import { AvailableSlotResponseDTO, AvailableSlotsPagedResponseDTO } from "@/application/dto/slot/response/get-slots.dto";
import { IBaseUseCase } from "@/application/interfaces/base-usecase.interface";
import { SessionType } from "@/domain/constants/session.constants";
import { PlanSessionType } from "@/domain/constants/subscription.constants";
import { ITrainerRepository } from "@/domain/interfaces/repositories/itrainer.repository";
import { IClientPreferenceRepository } from "@/domain/interfaces/repositories/onboarding/iclient.repository";
import { ISlotRepository } from "@/domain/interfaces/repositories/slot.repository";
import { ISubscriptionRepository } from "@/domain/interfaces/repositories/subscription.repository";
import { ISubscriptionPlanRepository } from "@/domain/interfaces/repositories/subscriptionPlan.repository";


export class GetAvailableSlotsUseCase implements IBaseUseCase<GetAvailableSlotsRequestDTO, AvailableSlotsPagedResponseDTO> {
    constructor(
        private readonly _slotRepository: ISlotRepository,
        private readonly _ClientPreferenceRepository: IClientPreferenceRepository,
        private readonly _trainerRepository: ITrainerRepository,
        private readonly _subscriptionPlanRepository: ISubscriptionPlanRepository,
        private readonly _subscriptionRepository: ISubscriptionRepository

    ) { }
    async execute(dto: GetAvailableSlotsRequestDTO): Promise<AvailableSlotsPagedResponseDTO> {
        const { userId, trainerId,page, limit, search } = dto;
        const skip = (page - 1) * limit;
        const activesub = await this._subscriptionRepository.findActiveByUserId(userId);
        if (!activesub) {
            if (!activesub) return { slots: [], total: 0 };
        }
        const plan = await this._subscriptionPlanRepository.findById(activesub.planId);
        if (!plan) {
            if (!plan) return { slots: [], total: 0 };
        }
        let requierdType: SessionType | undefined;
        if (plan.sessionType === PlanSessionType.ONE_ON_ONE) {
            requierdType = SessionType.ONE_ON_ONE;
        } else if (plan.sessionType === PlanSessionType.GROUP) {
            requierdType = SessionType.GROUP;
        }
        let trainerIdsToSearch: string[] = [];

        if (trainerId) {
            trainerIdsToSearch = [trainerId];
        } else {
            const preference = await this._ClientPreferenceRepository.findByUserId(userId);
            if (!preference || !preference.preferredWorkouts.length) {
                return { slots: [], total: 0 };
            }

            const matchingTrainerIds = await this._trainerRepository.findTrainerIdsBySpecializations(preference.preferredWorkouts);
            if (!matchingTrainerIds || matchingTrainerIds.length === 0) {
                return { slots: [], total: 0 };
            }
            trainerIdsToSearch = matchingTrainerIds;
        }
        const result = await this._slotRepository.findAvailableSlotsByTrainers({
            trainerIds: trainerIdsToSearch,
            skip,
            limit,
            search,
            type:requierdType
        });
     
        const mappedSlots: AvailableSlotResponseDTO[] = result.slots.map((slot) => ({
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
        return {
            slots: mappedSlots,
            total: result.total
        };
    }
}