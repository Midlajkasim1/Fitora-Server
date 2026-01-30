
import { IBaseUseCase } from "@/application/interfaces/base-usecase.interface";
import { IUserRepository } from "@/domain/interfaces/repositories/user.repository";
import { ITrainerRepository } from "@/domain/interfaces/repositories/onboarding/itrainer.repository";
import { TrainerDetailsEntity } from "@/domain/entities/user/trainer-details.entity";
import { TrainerOnboardingDTO } from "@/application/dto/auth/onboarding/request/trainer-onboarding.dto";
import { OnboardingResponseDTO } from "@/application/dto/auth/onboarding/response/onboarding-success.dto";
import { IStorageProvider } from "@/domain/interfaces/storage-provider.interface";
import { UploadFileDTO } from "@/application/dto/auth/onboarding/request/trainer-upload-file.dto";
export class CompleteTrainerOnboardingUseCase implements IBaseUseCase<TrainerOnboardingDTO, OnboardingResponseDTO,UploadFileDTO[]> {
  constructor(
    private readonly userRepo: IUserRepository,
    private readonly trainerRepo: ITrainerRepository,
    private readonly storageProvider: IStorageProvider
  ) {}

  async execute(dto: TrainerOnboardingDTO, files:UploadFileDTO[]=[]): Promise<OnboardingResponseDTO> {

    const certificationUrls = await Promise.all(
      files.map((file) => 
        this.storageProvider.uploadFile(file.buffer, file.originalname, file.mimetype)
      )
    );
    await this.userRepo.completeOnboarding(dto.userId, {
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

    await this.trainerRepo.save(trainerDetails);

    return {
      success: true,
      message: "Trainer onboarding submitted for approval"
    };
  }
}