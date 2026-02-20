
import { UserOnboardingDTO } from "@/application/dto/auth/onboarding/request/user-onboarding.dto";
import { OnboardingResponseDTO } from "@/application/dto/auth/onboarding/response/onboarding-success.dto";
import { IBaseUseCase } from "@/application/interfaces/base-usecase.interface";
import { DietPreference, ExperienceLevel } from "@/domain/constants/auth.constants";
import { ONBOARDING_MESSAGES } from "@/domain/constants/messages.constants";
import { ClientPreferenceEntity } from "@/domain/entities/user/client-preference.entity";
import { IClientPreferenceRepository } from "@/domain/interfaces/repositories/onboarding/iclient.repository";
import { IUserRepository } from "@/domain/interfaces/repositories/user.repository";

export class CompleteUserOnboardingUseCase implements IBaseUseCase<UserOnboardingDTO, OnboardingResponseDTO> {
  constructor(
    private _userRepo: IUserRepository,
    private _preferenceRepo: IClientPreferenceRepository
  ) {}

  async execute(dto: UserOnboardingDTO): Promise<OnboardingResponseDTO> {
    await this._userRepo.completeOnboarding(dto.userId, {
      dob: dto.dob,
      gender: dto.gender,
      isOnboardingRequired: false
    });

    const preference = ClientPreferenceEntity.create({
      userId: dto.userId,
      sleepHours: dto.sleep_hours,
      primaryMotives: dto.primary_motives,
      waterIntake: dto.water_intake,
      preferredWorkouts: dto.preferred_workouts,
      experienceLevel: dto.experience_level as ExperienceLevel,
      dietPreference: dto.diet_preference as DietPreference,
      medicalConditions: dto.medical_conditions
    });

    await this._preferenceRepo.save(preference);

    return {
      success: true,
      message: ONBOARDING_MESSAGES.CLIENT_COMPLETE
    };
  }
}