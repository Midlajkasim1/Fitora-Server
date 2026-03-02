import { UserRepository } from "@/infrastructure/database/repositories/user.repository";
import { UserMapper } from "@/infrastructure/database/mappers/user.mapper";
import { TrainerRepository } from "@/infrastructure/database/repositories/trainer-details.repository";
import { TrainerDetailsMapper } from "@/infrastructure/database/mappers/trainer-details.mapper";
import { ClientPreferenceRepository } from "@/infrastructure/database/repositories/client-preference.repository";
import { ClientPreferenceMapper } from "@/infrastructure/database/mappers/client-preference.mapper";
const userMapper = new UserMapper();
const trainerMapper = new TrainerDetailsMapper();
const clientPreferenceMapper= new ClientPreferenceMapper();
export const userRepositories = {
  userRepository: new UserRepository(userMapper) ,
  trainerRepository: new TrainerRepository(trainerMapper,userMapper),
    clientPreferenceRepository: new ClientPreferenceRepository(clientPreferenceMapper),
  

};
