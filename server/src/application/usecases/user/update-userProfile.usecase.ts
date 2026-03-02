import { UpdateUserProfileRequest } from "@/application/dto/user/request/update-userProfie.dto";
import { updateUserProfileResponse } from "@/application/dto/user/response/update-userProfile.dto";
import { IBaseUseCase } from "@/application/interfaces/base-usecase.interface";
import { DietPreference, ExperienceLevel } from "@/domain/constants/auth.constants";
import { AUTH_MESSAGES, USER_MESSAGES } from "@/domain/constants/messages.constants";
import { ClientPreferenceEntity } from "@/domain/entities/user/client-preference.entity";
import { UserEntity } from "@/domain/entities/user/user.entity";
import { IClientPreferenceRepository } from "@/domain/interfaces/repositories/onboarding/iclient.repository";
import { IUserRepository } from "@/domain/interfaces/repositories/user.repository";



export class UpdateUserProfileUseCase implements IBaseUseCase<UpdateUserProfileRequest, updateUserProfileResponse> {
    constructor(
        private readonly _userRepository: IUserRepository,
        private readonly _clientPreferenceRepository: IClientPreferenceRepository,
    ) { }
    async execute(dto: UpdateUserProfileRequest): Promise<updateUserProfileResponse> {
        const existing = await this._userRepository.findById(dto.id);
        if (!existing) {
            throw new Error(AUTH_MESSAGES.USER_NOT_FOUND);
        }
        const updatedUser = UserEntity.create({
            id: existing.id,
            email: existing.email,
            role: existing.role,
            status: existing.status,
            isEmailVerified: existing.isEmailVerified,
            isOnboardingRequired: existing.isOnboardingRequired,
            approvalStatus: existing.approvalStatus,
            createdAt: existing.createdAt,

            firstName: dto.firstName ?? existing.firstName,
            lastName: dto.lastName ?? existing.lastName,
            phone: dto.phone ?? existing.phone,
            profileImage: existing.profileImage,
            dob: existing.dob,
            gender: existing.gender,
        });
        await this._userRepository.updateUserProfile(updatedUser);

        const clientPreference = await this._clientPreferenceRepository.findByUserId(dto.id);

        const updatedPreference = ClientPreferenceEntity.create({
            userId: dto.id,
            sleepHours: clientPreference?.sleepHours ?? 8,
            waterIntake: clientPreference?.waterIntake ?? 3,
            primaryMotives: clientPreference?.primaryMotives ?? [],
            preferredWorkouts: dto.preferredWorkouts ?? clientPreference?.preferredWorkouts ?? [],
            experienceLevel: dto.experienceLevel ?? clientPreference?.experienceLevel ?? ExperienceLevel.BEGINNER,
            dietPreference: clientPreference?.dietPreference ?? DietPreference.KETO,
            medicalConditions: clientPreference?.medicalConditions ?? []
        });

        await this._clientPreferenceRepository.save(updatedPreference);


        return {
            message: USER_MESSAGES.PROFILE_UPDATED
        };
    }

}