import { UserRepository } from "@/infrastructure/database/repositories/user.repository";
import { IUserRepository } from "@/domain/interfaces/repositories/user.repository";
import { UserMapper } from "@/infrastructure/database/mappers/user.mapper";
const userMapper = new UserMapper();

export const userRepositories = {
  userRepository: new UserRepository(userMapper) 
};
