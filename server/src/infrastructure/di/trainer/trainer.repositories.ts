import { HealthMetricsMapper } from "@/infrastructure/database/mappers/client.health.metrics.mapper";
import { SlotMapper } from "@/infrastructure/database/mappers/slot.mapper";
import { SpecializationMapper } from "@/infrastructure/database/mappers/specialization.mapper";
import { TrainerDetailsMapper } from "@/infrastructure/database/mappers/trainer-details.mapper";
import { TransactionMapper } from "@/infrastructure/database/mappers/transaction.mapper";
import { UserMapper } from "@/infrastructure/database/mappers/user.mapper";
import { HealthMetricsRepository } from "@/infrastructure/database/repositories/client-health-metrics";
import { SlotRepository } from "@/infrastructure/database/repositories/slot.repository";
import { SpecializationRepository } from "@/infrastructure/database/repositories/specialization.repository";
import { TrainerRepository } from "@/infrastructure/database/repositories/trainer-details.repository";
import { TransactionRepository } from "@/infrastructure/database/repositories/transaction.repository";
import { UserRepository } from "@/infrastructure/database/repositories/user.repository";

const slotMapper=new SlotMapper();
const userMapper = new UserMapper();
const trainerMapper = new TrainerDetailsMapper();
const healthMetricsMapper = new HealthMetricsMapper();
const specializationMapper = new SpecializationMapper();
const transactionMapper = new TransactionMapper();

export const trainerRepositories = {
  slotRepository:new SlotRepository(slotMapper),
  userRepository:new UserRepository(userMapper),
  trainerRepository:new TrainerRepository(trainerMapper,userMapper),
  healthMetricsRepository: new HealthMetricsRepository(healthMetricsMapper),
  specializationRepository: new SpecializationRepository(specializationMapper),
  transactionRepository: new TransactionRepository(transactionMapper)
};