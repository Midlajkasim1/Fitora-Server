import { ClientPreferenceRepository } from "@/infrastructure/database/repositories/client-preference.repository";
import { TrainerRepository } from "@/infrastructure/database/repositories/trainer-details.repository";
import { userRepositories } from "../user.repositories";
import { ClientPreferenceMapper } from "@/infrastructure/database/mappers/client-preference.mapper";
import { TrainerDetailsMapper } from "@/infrastructure/database/mappers/trainer-details.mapper";

const clientPreferenceMapper = new ClientPreferenceMapper();
const trainerMapper = new TrainerDetailsMapper();
export const onboardingRepositories = {
  userRepository: userRepositories.userRepository, 
  clientPreferenceRepository: new ClientPreferenceRepository(clientPreferenceMapper),
  trainerRepository: new TrainerRepository(trainerMapper),
};