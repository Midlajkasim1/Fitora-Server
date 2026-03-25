import { AdvertisementMapper } from "@/infrastructure/database/mappers/advertisement.mapper";
import { SpecializationMapper } from "@/infrastructure/database/mappers/specialization.mapper";
import { SubscriptionPlanMapper } from "@/infrastructure/database/mappers/subscriptionPlan.mapper";
import { TrainerDetailsMapper } from "@/infrastructure/database/mappers/trainer-details.mapper";
import { UserMapper } from "@/infrastructure/database/mappers/user.mapper";
import { WorkoutMapper } from "@/infrastructure/database/mappers/workout.mapper";
import { AdminRepository } from "@/infrastructure/database/repositories/admin.repository";
import { AdvertisementRepository } from "@/infrastructure/database/repositories/advertisement.repository";
import { SpecializationRepository } from "@/infrastructure/database/repositories/specialization.repository";
import { SubscriptionplanRepository } from "@/infrastructure/database/repositories/subscriptionPlan.repository";
import { TrainerRepository } from "@/infrastructure/database/repositories/trainer-details.repository";
import { UserRepository } from "@/infrastructure/database/repositories/user.repository";
import { WorkoutRepository } from "@/infrastructure/database/repositories/workout.repository";

const userMapper = new UserMapper();
const specialistaionMapper = new SpecializationMapper();
const trainerDetailsMapper = new TrainerDetailsMapper();
const subscriptionplanMapper = new SubscriptionPlanMapper();
const workoutMapper =new WorkoutMapper();
const advertisementMapper = new AdvertisementMapper();
export const adminRepositories = {
  adminRepository: new AdminRepository(),
  userRepository: new UserRepository(userMapper),
  specialisatonRepository: new SpecializationRepository(specialistaionMapper),
  trainerDetailsRepository: new TrainerRepository(trainerDetailsMapper,userMapper),
  workoutRepository:new WorkoutRepository(workoutMapper),
   subcriptionPlanRepository :new SubscriptionplanRepository(subscriptionplanMapper),
   advertisementRepository:new AdvertisementRepository(advertisementMapper)

};
