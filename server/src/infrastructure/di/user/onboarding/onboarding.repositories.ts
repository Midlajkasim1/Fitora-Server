import { ClientPreferenceRepository } from "@/infrastructure/database/repositories/client-preference.repository";
import { TrainerRepository } from "@/infrastructure/database/repositories/trainer-details.repository";
import { userRepositories } from "../user.repositories";

export const onboardingRepositories = {
  userRepository: userRepositories.userRepository, 
  clientPreferenceRepository: new ClientPreferenceRepository(),
  trainerRepository: new TrainerRepository(),
};