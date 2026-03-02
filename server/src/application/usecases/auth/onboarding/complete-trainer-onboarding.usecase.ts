
import { TrainerOnboardingDTO } from "@/application/dto/auth/onboarding/request/trainer-onboarding.dto";
import { UploadFileDTO } from "@/application/dto/auth/onboarding/request/trainer-upload-file.dto";
import { OnboardingResponseDTO } from "@/application/dto/auth/onboarding/response/onboarding-success.dto";
import { IBaseUseCase } from "@/application/interfaces/base-usecase.interface";
import { ONBOARDING_MESSAGES } from "@/domain/constants/messages.constants";
import { TrainerDetailsEntity } from "@/domain/entities/user/trainer-details.entity";
import { ITrainerRepository } from "@/domain/interfaces/repositories/onboarding/itrainer.repository";
import { IUserRepository } from "@/domain/interfaces/repositories/user.repository";
import { IStorageProvider } from "@/domain/interfaces/services/storage-provider.interface";
export class CompleteTrainerOnboardingUseCase implements IBaseUseCase<TrainerOnboardingDTO, OnboardingResponseDTO,UploadFileDTO[]> {
  constructor(
    private readonly _userRepo: IUserRepository,
    private readonly _trainerRepo: ITrainerRepository,
    private readonly _storageProvider: IStorageProvider
  ) {}

  async execute(dto: TrainerOnboardingDTO, files:UploadFileDTO[]=[]): Promise<OnboardingResponseDTO> {

    const certificationUrls = await Promise.all(
      files.map((file) => 
        this._storageProvider.uploadCertificate(file.buffer, file.originalname, file.mimetype)
      )
    );
    await this._userRepo.completeOnboarding(dto.userId, {
      dob: new Date(), 
      gender: dto.gender,
      isOnboardingRequired: false
    });

    const trainerDetails = TrainerDetailsEntity.create({
      userId: dto.userId,
      bio: dto.bio,
      experienceYear: dto.experience_year,
      certifications: certificationUrls,
      specializations: dto.specializations
    });

    await this._trainerRepo.save(trainerDetails);

    return {
      success: true,
      message: ONBOARDING_MESSAGES.TRAINER_SUBMITTED
    };
  }
}