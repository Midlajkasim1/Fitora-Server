import { UserRepository } from "@/infrastructure/database/repositories/user.repository";
import { UserMapper } from "@/infrastructure/database/mappers/user.mapper";
import { TrainerRepository } from "@/infrastructure/database/repositories/trainer-details.repository";
const userMapper = new UserMapper();

export const userRepositories = {
  userRepository: new UserRepository(userMapper) ,
  trainerRepository: new TrainerRepository()

};
