import { GetUserProfileResponse } from "@/application/dto/user/response/get-userProfile.dto";
import { IBaseUseCase } from "@/application/interfaces/base-usecase.interface";
import { AUTH_MESSAGES } from "@/domain/constants/messages.constants";
import { IClientPreferenceRepository } from "@/domain/interfaces/repositories/onboarding/iclient.repository";
import { IUserRepository } from "@/domain/interfaces/repositories/user.repository";



export class GetUserProfileUseCase implements IBaseUseCase<string, GetUserProfileResponse> {
    constructor(
        private readonly _userRepository: IUserRepository,
        private readonly _clientPreferenceRepository:IClientPreferenceRepository
    ) { }
    async execute(userId: string): Promise<GetUserProfileResponse> {
        const user = await this._userRepository.findById(userId);
        if (!user) {
            throw new Error(AUTH_MESSAGES.USER_NOT_FOUND);
        }
        const preference = await this._clientPreferenceRepository.findByUserId(userId);
        return new GetUserProfileResponse({
            id: user.id!,
            firstName: user.firstName,
            lastName: user.lastName,
            gender:user.gender,
            phone: user.phone,
            profileImage: user.profileImage,
            status: user.status,
            preferredWorkouts: preference?.preferredWorkouts,
            experienceLevel: preference?.experienceLevel ,
   

        });
    }

}