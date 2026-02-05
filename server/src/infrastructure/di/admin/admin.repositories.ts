import { UserMapper } from "@/infrastructure/database/mappers/user.mapper";
import { AdminRepository } from "@/infrastructure/database/repositories/admin.repository";
import { UserRepository } from "@/infrastructure/database/repositories/user.repository";

const userMapper = new UserMapper();
export const adminRepositories = {
  adminRepository: new AdminRepository(),
  userRepository: new UserRepository(userMapper),
};
