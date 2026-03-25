import { ClientPreferenceRepository } from "@/infrastructure/database/repositories/client-preference.repository";
import { TrainerRepository } from "@/infrastructure/database/repositories/trainer-details.repository";
import { userRepositories } from "../user.repositories";
import { ClientPreferenceMapper } from "@/infrastructure/database/mappers/client-preference.mapper";
import { TrainerDetailsMapper } from "@/infrastructure/database/mappers/trainer-details.mapper";
import { SpecializationRepository } from "@/infrastructure/database/repositories/specialization.repository";
import { SpecializationMapper } from "@/infrastructure/database/mappers/specialization.mapper";
import { UserMapper } from "@/infrastructure/database/mappers/user.mapper";

const clientPreferenceMapper = new ClientPreferenceMapper();
const trainerMapper = new TrainerDetailsMapper();
const specialistaionMapper = new SpecializationMapper();
const userMapper = new UserMapper();

export const onboardingRepositories = {
  userRepository: userRepositories.userRepository, 
  clientPreferenceRepository: new ClientPreferenceRepository(clientPreferenceMapper),
  trainerRepository: new TrainerRepository(trainerMapper,userMapper),
    specialisatonRepository: new SpecializationRepository(specialistaionMapper),
  
};