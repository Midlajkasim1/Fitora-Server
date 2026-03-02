import { CompleteUserOnboardingUseCase } from "@/application/usecases/auth/onboarding/complete-user-onboarding.usecase";
import { CompleteTrainerOnboardingUseCase } from "@/application/usecases/auth/onboarding/complete-trainer-onboarding.usecase";
import { onboardingRepositories } from "./onboarding.repositories";
import { S3StorageProvider } from "@/infrastructure/providers/storage/s3-storage.provider";
import { GetActiveSpecializationUseCase } from "@/application/usecases/user/get-activeSpecialization.usecase";

const storageProvider = new S3StorageProvider();

export const onboardingUseCases = {
  completeUserOnboarding: new CompleteUserOnboardingUseCase(
    onboardingRepositories.userRepository,
    onboardingRepositories.clientPreferenceRepository
  ),
  completeTrainerOnboarding: new CompleteTrainerOnboardingUseCase(
    onboardingRepositories.userRepository,
    onboardingRepositories.trainerRepository,
    storageProvider
  ),
  getActiveSpecialization : new GetActiveSpecializationUseCase(
     onboardingRepositories.specialisatonRepository
  )
};