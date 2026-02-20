import { UserRepository } from "@/infrastructure/database/repositories/user.repository";
import { UserMapper } from "@/infrastructure/database/mappers/user.mapper";
import { TrainerRepository } from "@/infrastructure/database/repositories/trainer-details.repository";
import { TrainerDetailsMapper } from "@/infrastructure/database/mappers/trainer-details.mapper";
const userMapper = new UserMapper();
const trainerMapper = new TrainerDetailsMapper();
export const userRepositories = {
  userRepository: new UserRepository(userMapper) ,
  trainerRepository: new TrainerRepository(trainerMapper)

};
