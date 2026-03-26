// import { AvailableSlotResponseDTO } from "@/application/dto/slot/response/get-slots.dto";
// import { IBaseUseCase } from "@/application/interfaces/base-usecase.interface";
// import { IClientPreferenceRepository } from "@/domain/interfaces/repositories/onboarding/iclient.repository";
// import { ITrainerRepository } from "@/domain/interfaces/repositories/onboarding/itrainer.repository";
// import { ISlotRepository } from "@/domain/interfaces/repositories/slot.repository";
// import { IUserRepository } from "@/domain/interfaces/repositories/user.repository";


// export class GetAvailableSlotsUseCase implements IBaseUseCase<string,AvailableSlotResponseDTO>{
//     constructor(
//         private readonly _slotRepository:ISlotRepository,
//         private readonly _ClientPreferenceRepository:IClientPreferenceRepository,
//         private readonly _trainerRepository:ITrainerRepository,
//         private readonly _userRepository:IUserRepository
//     ){}
//     async execute(userId: string): Promise<AvailableSlotResponseDTO> {
//        const preference = await this._ClientPreferenceRepository.findByUserId(userId);
//        if (!preference) {
//         return [];
//     }
//     const trainerIds = await this._trainerRepository.findTrainerIdsBySpecializations(
//         preference.preferredWorkouts
//     );
//     if (!trainerIds || trainerIds.length === 0) {
//         return [];
//     }
//     const rawSlots = await this._slotRepository.findAvailableSlotsByTrainers(trainerIds);
//     const finalSlots = await this._(rawSlots);

//     return finalSlots;
//     }


// }