import { GetTrainerProfileResponse } from "@/application/dto/trainer/response/get-trainerProfile.dto";
import { IBaseUseCase } from "@/application/interfaces/base-usecase.interface";
import { AUTH_MESSAGES } from "@/domain/constants/messages.constants";
import { ITrainerRepository } from "@/domain/interfaces/repositories/itrainer.repository";
import { IUserRepository } from "@/domain/interfaces/repositories/user.repository";


export class GetTrainerProfileUseCase implements IBaseUseCase<string,GetTrainerProfileResponse>{
    constructor(
        private readonly _userRepository:IUserRepository,
        private readonly _trainerRepository:ITrainerRepository
    ){}
    async execute(userId: string): Promise<GetTrainerProfileResponse> {
        const trainer = await this._userRepository.findById(userId);
        if(!trainer){
            throw new Error(AUTH_MESSAGES.USER_NOT_FOUND);
        }
        const trainerDetails = await this._trainerRepository.findByTrainerId(userId);
        return new GetTrainerProfileResponse({
            id:trainer.id!,
            firstName:trainer.firstName,
            lastName:trainer.lastName,
            phone:trainer.phone,
            experience_year:trainerDetails?.experienceYear,
            profileImage:trainer.profileImage,
            status:trainer.status

        });
    }
}