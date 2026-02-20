import { SpecializationMapper } from "@/infrastructure/database/mappers/specialization.mapper";
import { UserMapper } from "@/infrastructure/database/mappers/user.mapper";
import { AdminRepository } from "@/infrastructure/database/repositories/admin.repository";
import { SpecializationRepository } from "@/infrastructure/database/repositories/specialization.repository";
import { UserRepository } from "@/infrastructure/database/repositories/user.repository";

const userMapper = new UserMapper();
const specialistaionMapper = new SpecializationMapper();
export const adminRepositories = {
  adminRepository: new AdminRepository(),
  userRepository: new UserRepository(userMapper),
  specialisatonRepository: new SpecializationRepository(specialistaionMapper),
};
