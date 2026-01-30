import { OnboardingController } from "@/presentation/controllers/user/onboarding.controller";
import { onboardingUseCases } from "./onboarding.usecase";
export const onboardingControllers = {
  onboardingController: new OnboardingController(
    onboardingUseCases.completeUserOnboarding,
    onboardingUseCases.completeTrainerOnboarding
  ),
};