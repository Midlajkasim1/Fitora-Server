import { AdvertisementMapper } from "@/infrastructure/database/mappers/advertisement.mapper";
import { HealthMetricsMapper } from "@/infrastructure/database/mappers/client-health-metrics.mapper";
import { ClientPreferenceMapper } from "@/infrastructure/database/mappers/client-preference.mapper";
import { PaymentMapper } from "@/infrastructure/database/mappers/payment.mapper";
import { SpecializationMapper } from "@/infrastructure/database/mappers/specialization.mapper";
import { SubscriptionMapper } from "@/infrastructure/database/mappers/subscription.mapper";
import { SubscriptionPlanMapper } from "@/infrastructure/database/mappers/subscriptionPlan.mapper";
import { TrainerDetailsMapper } from "@/infrastructure/database/mappers/trainer-details.mapper";
import { UserMapper } from "@/infrastructure/database/mappers/user.mapper";
import { WorkoutMapper } from "@/infrastructure/database/mappers/workout.mapper";
import { AdvertisementRepository } from "@/infrastructure/database/repositories/advertisement.repository";
import { HealthMetricsRepository } from "@/infrastructure/database/repositories/client-health-metrics";
import { ClientPreferenceRepository } from "@/infrastructure/database/repositories/client-preference.repository";
import { PaymentRepository } from "@/infrastructure/database/repositories/paymentRepository";
import { SpecializationRepository } from "@/infrastructure/database/repositories/specialization.repository";
import { SubscriptionRepository } from "@/infrastructure/database/repositories/subscription.repository";
import { SubscriptionplanRepository } from "@/infrastructure/database/repositories/subscriptionPlan.repository";
import { TrainerRepository } from "@/infrastructure/database/repositories/trainer-details.repository";
import { UserRepository } from "@/infrastructure/database/repositories/user.repository";
import { WorkoutRepository } from "@/infrastructure/database/repositories/workout.repository";
const userMapper = new UserMapper();
const trainerMapper = new TrainerDetailsMapper();
const clientPreferenceMapper= new ClientPreferenceMapper();
const specializationMapper = new SpecializationMapper();
const workoutMapper = new WorkoutMapper();
const subscriptionPlanMapper = new SubscriptionPlanMapper();
const subscriptionMapper= new SubscriptionMapper();
const paymentMapper = new PaymentMapper();
const clientHealthMetrics = new HealthMetricsMapper();
const advertisementMapper = new AdvertisementMapper();

export const userRepositories = {
  userRepository: new UserRepository(userMapper) ,
  trainerRepository: new TrainerRepository(trainerMapper,userMapper),
  clientPreferenceRepository: new ClientPreferenceRepository(clientPreferenceMapper),
   specializationRepository: new SpecializationRepository(specializationMapper),
   workoutRepository : new WorkoutRepository(workoutMapper),
   subscriptionPlanRepository:new SubscriptionplanRepository(subscriptionPlanMapper),
   subscriptionRepository:new SubscriptionRepository(subscriptionMapper),
   paymentRepository:new PaymentRepository(paymentMapper),
   clientHealthMetricRepository:new HealthMetricsRepository(clientHealthMetrics),
   advertisementRepository:new AdvertisementRepository(advertisementMapper)
   
  
  

};
