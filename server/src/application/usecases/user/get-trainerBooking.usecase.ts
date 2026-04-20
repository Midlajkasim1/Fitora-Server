import { GetTrainersBookingRequestDTO } from "@/application/dto/user/request/get-trainerBooking.dto";
import { GetTrainersBookingResponseDTO, TrainerBookingDTO } from "@/application/dto/user/response/get-trainerBooking.dto";
import { IBaseUseCase } from "@/application/interfaces/base-usecase.interface";
import { SUBSCRIPTION_MESSAGES } from "@/domain/constants/messages.constants";
import { ITrainerRepository } from "@/domain/interfaces/repositories/itrainer.repository";
import { IClientPreferenceRepository } from "@/domain/interfaces/repositories/onboarding/iclient.repository";
import { ISubscriptionRepository } from "@/domain/interfaces/repositories/subscription.repository";


export class GetTrainerBookingUseCase implements IBaseUseCase<GetTrainersBookingRequestDTO,GetTrainersBookingResponseDTO>{
    constructor(
        private readonly _trainerRepository:ITrainerRepository,
        private readonly _subscriptionRepsitory:ISubscriptionRepository,
        private readonly _clientPreferenceRepository:IClientPreferenceRepository
    ){}
    async execute(dto: GetTrainersBookingRequestDTO): Promise<GetTrainersBookingResponseDTO> {
        const skip = (dto.page - 1) * dto.limit;
        const sub = await this._subscriptionRepsitory.findActiveByUserId(dto.userId);
        if(!sub){
            throw new Error(SUBSCRIPTION_MESSAGES.SUBSCRIPTION_NOT_FOUND);
        }
        const pref = await this._clientPreferenceRepository.findByUserId(dto.userId);
        if(!pref){
            return {trainers:[],total:0};
        }
        const trainerIds= await this._trainerRepository.findTrainerIdsBySpecializations(pref.preferredWorkouts);
    
        const result = await this._trainerRepository.findTrainerForBooking({
            trainerIds:trainerIds,
            search:dto.search,
            skip:skip,
            limit:dto.limit
        });
        const mappedTrainers: TrainerBookingDTO[] = result.data.map((trainer: Record<string, unknown>) => ({
        trainerId: trainer.trainerId as string,
        name: trainer.name as string,
        profileImage: trainer.profileImage as string | undefined,
        specializations: trainer.specializations as string,
        experience: trainer.experience as number,
        rating: trainer.rating as number,
        bio: trainer.bio as string,
        availableSlotsCount: trainer.availableSlotsCount as number
    }));
    return {
        trainers:mappedTrainers,
        total:result.total
    };
}
}