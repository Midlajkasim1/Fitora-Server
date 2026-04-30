import { AdvertisementMapper } from "@/infrastructure/database/mappers/advertisement.mapper";
import { SpecializationMapper } from "@/infrastructure/database/mappers/specialization.mapper";
import { SubscriptionPlanMapper } from "@/infrastructure/database/mappers/subscriptionPlan.mapper";
import { TrainerDetailsMapper } from "@/infrastructure/database/mappers/trainer-details.mapper";
import { UserMapper } from "@/infrastructure/database/mappers/user.mapper";
import { WorkoutMapper } from "@/infrastructure/database/mappers/workout.mapper";
import { AdminMapper } from "@/infrastructure/database/mappers/admin.mapper";
import { AdminRepository } from "@/infrastructure/database/repositories/admin.repository";
import { AdvertisementRepository } from "@/infrastructure/database/repositories/advertisement.repository";
import { SpecializationRepository } from "@/infrastructure/database/repositories/specialization.repository";
import { SubscriptionplanRepository } from "@/infrastructure/database/repositories/subscriptionPlan.repository";
import { SubscriptionRepository } from "@/infrastructure/database/repositories/subscription.repository";
import { SubscriptionMapper } from "@/infrastructure/database/mappers/subscription.mapper";
import { TrainerRepository } from "@/infrastructure/database/repositories/trainer-details.repository";
import { UserRepository } from "@/infrastructure/database/repositories/user.repository";
import { WorkoutRepository } from "@/infrastructure/database/repositories/workout.repository";
import { MongooseReportRepository } from "@/infrastructure/database/repositories/report.repository";
import { TransactionMapper } from "@/infrastructure/database/mappers/transaction.mapper";
import { TransactionRepository } from "@/infrastructure/database/repositories/transaction.repository";
import { PaymentRepository } from "@/infrastructure/database/repositories/paymentRepository";
import { SlotRepository } from "@/infrastructure/database/repositories/slot.repository";
import { PaymentMapper } from "@/infrastructure/database/mappers/payment.mapper";
import { SlotMapper } from "@/infrastructure/database/mappers/slot.mapper";

const userMapper = new UserMapper();
const specialistaionMapper = new SpecializationMapper();
const trainerDetailsMapper = new TrainerDetailsMapper();
const subscriptionplanMapper = new SubscriptionPlanMapper();
const workoutMapper =new WorkoutMapper();
const advertisementMapper = new AdvertisementMapper();
const transactionMapper = new TransactionMapper();
const adminMapper = new AdminMapper();
const paymentMapper = new PaymentMapper();
const slotMapper = new SlotMapper();
const subscriptionMapper = new SubscriptionMapper();

export const adminRepositories = {
  adminRepository: new AdminRepository(adminMapper),
  userRepository: new UserRepository(userMapper),
  specialisatonRepository: new SpecializationRepository(specialistaionMapper),
  trainerDetailsRepository: new TrainerRepository(trainerDetailsMapper,userMapper),
  workoutRepository:new WorkoutRepository(workoutMapper),
   subcriptionPlanRepository :new SubscriptionplanRepository(subscriptionplanMapper),
   advertisementRepository:new AdvertisementRepository(advertisementMapper),
   reportRepository: new MongooseReportRepository(),
   transactionRepository: new TransactionRepository(transactionMapper),
   paymentRepository: new PaymentRepository(paymentMapper),
   slotRepository: new SlotRepository(slotMapper),
   subscriptionRepository: new SubscriptionRepository(subscriptionMapper)
};

