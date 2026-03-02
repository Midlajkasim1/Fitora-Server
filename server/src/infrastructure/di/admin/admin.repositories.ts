import { SpecializationMapper } from "@/infrastructure/database/mappers/specialization.mapper";
import { TrainerDetailsMapper } from "@/infrastructure/database/mappers/trainer-details.mapper";
import { UserMapper } from "@/infrastructure/database/mappers/user.mapper";
import { WorkoutMapper } from "@/infrastructure/database/mappers/workout.mapper";
import { AdminRepository } from "@/infrastructure/database/repositories/admin.repository";
import { SpecializationRepository } from "@/infrastructure/database/repositories/specialization.repository";
import { TrainerRepository } from "@/infrastructure/database/repositories/trainer-details.repository";
import { UserRepository } from "@/infrastructure/database/repositories/user.repository";
import { WorkoutRepository } from "@/infrastructure/database/repositories/workout.repository";

const userMapper = new UserMapper();
const specialistaionMapper = new SpecializationMapper();
const trainerDetailsMapper = new TrainerDetailsMapper();
const workoutMapper =new WorkoutMapper();
export const adminRepositories = {
  adminRepository: new AdminRepository(),
  userRepository: new UserRepository(userMapper),
  specialisatonRepository: new SpecializationRepository(specialistaionMapper),
  trainerDetailsRepository: new TrainerRepository(trainerDetailsMapper,userMapper),
  workoutRepository:new WorkoutRepository(workoutMapper)
};
