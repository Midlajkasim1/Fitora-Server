import { UserRepository } from "@/infrastructure/database/repositories/user.repository";
import { IUserRepository } from "@/domain/interfaces/repositories/user.repository";

export const repositories = {
  userRepository: new UserRepository() as IUserRepository,
};
