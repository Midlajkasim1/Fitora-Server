import { UserRepository } from "@/infrastructure/database/repositories/user.repository";
import { UserMapper } from "@/infrastructure/database/mappers/user.mapper";
import { TrainerRepository } from "@/infrastructure/database/repositories/trainer-details.repository";
import { TrainerDetailsMapper } from "@/infrastructure/database/mappers/trainer-details.mapper";
import { ClientPreferenceRepository } from "@/infrastructure/database/repositories/client-preference.repository";
import { ClientPreferenceMapper } from "@/infrastructure/database/mappers/client-preference.mapper";
import { SpecializationRepository } from "@/infrastructure/database/repositories/specialization.repository";
import { SpecializationMapper } from "@/infrastructure/database/mappers/specialization.mapper";
import { WorkoutRepository } from "@/infrastructure/database/repositories/workout.repository";
import { WorkoutMapper } from "@/infrastructure/database/mappers/workout.mapper";
import { SubscriptionMapper } from "@/infrastructure/database/mappers/subscription.mapper";
import { SubscriptionRepository } from "@/infrastructure/database/repositories/subscription.repository";
const userMapper = new UserMapper();
const trainerMapper = new TrainerDetailsMapper();
const clientPreferenceMapper= new ClientPreferenceMapper();
const specializationMapper = new SpecializationMapper();
const workoutMapper = new WorkoutMapper();
const subscriptionMapper = new SubscriptionMapper();

export const userRepositories = {
  userRepository: new UserRepository(userMapper) ,
  trainerRepository: new TrainerRepository(trainerMapper,userMapper),
  clientPreferenceRepository: new ClientPreferenceRepository(clientPreferenceMapper),
   specializationRepository: new SpecializationRepository(specializationMapper),
   workoutRepository : new WorkoutRepository(workoutMapper),
   subscriptionRepository:new SubscriptionRepository(subscriptionMapper)
  
  

};
