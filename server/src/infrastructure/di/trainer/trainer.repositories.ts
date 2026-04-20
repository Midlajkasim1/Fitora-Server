import { HealthMetricsMapper } from "@/infrastructure/database/mappers/client-health-metrics.mapper";
import { HealthMetricsRepository } from "@/infrastructure/database/repositories/client-health-metrics";
import { SlotMapper } from "@/infrastructure/database/mappers/slot.mapper";
import { TrainerDetailsMapper } from "@/infrastructure/database/mappers/trainer-details.mapper";
import { UserMapper } from "@/infrastructure/database/mappers/user.mapper";
import { SlotRepository } from "@/infrastructure/database/repositories/slot.repository";
import { TrainerRepository } from "@/infrastructure/database/repositories/trainer-details.repository";
import { UserRepository } from "@/infrastructure/database/repositories/user.repository";
import { SpecializationMapper } from "@/infrastructure/database/mappers/specialization.mapper";
import { SpecializationRepository } from "@/infrastructure/database/repositories/specialization.repository";

const slotMapper=new SlotMapper();
const userMapper = new UserMapper();
const trainerMapper = new TrainerDetailsMapper();
const healthMetricsMapper = new HealthMetricsMapper();
const specializationMapper = new SpecializationMapper();

export const trainerRepositories = {
  slotRepository:new SlotRepository(slotMapper),
  userRepository:new UserRepository(userMapper),
  trainerRepository:new TrainerRepository(trainerMapper,userMapper),
  healthMetricsRepository: new HealthMetricsRepository(healthMetricsMapper),
  specializationRepository: new SpecializationRepository(specializationMapper)
};