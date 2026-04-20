import { GetTrainerProfileResponse } from "@/application/dto/trainer/response/get-trainerProfile.dto";
import { IBaseUseCase } from "@/application/interfaces/base-usecase.interface";
import { AUTH_MESSAGES } from "@/domain/constants/messages.constants";
import { ITrainerRepository } from "@/domain/interfaces/repositories/itrainer.repository";
import { IUserRepository } from "@/domain/interfaces/repositories/user.repository";
import { ISpecialization } from "@/domain/interfaces/repositories/specialization.interface";


export class GetTrainerProfileUseCase implements IBaseUseCase<string,GetTrainerProfileResponse>{
    constructor(
        private readonly _userRepository:IUserRepository,
        private readonly _trainerRepository:ITrainerRepository,
        private readonly _specializationRepository: ISpecialization
    ){}
    async execute(userId: string): Promise<GetTrainerProfileResponse> {
        const user = await this._userRepository.findById(userId);
        if(!user){
            throw new Error(AUTH_MESSAGES.USER_NOT_FOUND);
        }
        const trainerDetails = await this._trainerRepository.findByTrainerId(userId);
        
        let specializationName: string | undefined;
        if (trainerDetails?.specializations) {
            const spec = await this._specializationRepository.findById(trainerDetails.specializations);
            specializationName = spec?.name;
        }

        return new GetTrainerProfileResponse({
            id:user.id!,
            firstName:user.firstName,
            lastName:user.lastName,
            phone:user.phone,
            experience_year:trainerDetails?.experienceYear,
            profileImage:user.profileImage,
            status:user.status,
            specializationName: specializationName,
            specializationId: trainerDetails?.specializations
        });
    }
}