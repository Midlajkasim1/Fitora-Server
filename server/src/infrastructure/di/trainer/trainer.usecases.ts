import { TrainerCreateSlotUseCase } from "@/application/usecases/slot/create.slot.usecase";
import { TrainerEditSlotUseCase } from "@/application/usecases/slot/edit.slot.usecase";
import { GetTrainerGroupUserUseCase } from "@/application/usecases/slot/get.trainer.groupUsersSlot.usecase";
import { GetTrainerOneOnOneUserUseCase } from "@/application/usecases/slot/get.trainer.personalUserSlot";
import { GetTrainerUpcomingSlotsUseCase } from "@/application/usecases/slot/get.trainer.upcomingSlot.usecase";
import { TrainerCancelSlotUseCase, } from "@/application/usecases/slot/trainer.cancel.slot.usecase";
import { GetClientDetailsUseCase } from "@/application/usecases/trainer/get.client.details.usecase";
import { GetTrainerWalletUseCase } from "@/application/usecases/trainer/get.trainer.wallet.usecase";
import { GetTrainerDashboardUseCase } from "@/application/usecases/trainer/get.trainerDashboard.usecase";
import { GetTrainerProfileUseCase } from "@/application/usecases/trainer/get.trainerProfile.usecase";
import { RequestPayoutUseCase } from "@/application/usecases/trainer/request.payout.usecase";
import { UpdateTrainerProfileUseCase } from "@/application/usecases/trainer/updatetrainerProfile.usecase";
import { UploadTrainerImageUseCase } from "@/application/usecases/trainer/uploadTrainerImage.usecase";
import { ChangePasswordUseCase } from "@/application/usecases/user/change.password.usecase";
import { BullJobScheduler } from "@/infrastructure/providers/bullQueue/bull-job-scheduler";
import { BcryptPasswordHasher } from "@/infrastructure/providers/crypto/bcrypt-password.service";
import { notificationServiceProxy } from "@/infrastructure/providers/notification/notification.provider";
import { S3StorageProvider } from "@/infrastructure/providers/storage/s3-storage.provider";
import { trainerRepositories } from "./trainer.repositories";

const jobScheduler = new BullJobScheduler();
const storageProvider = new S3StorageProvider();
const passwordHasher = new BcryptPasswordHasher();


export const trainerUsecase ={
   getClientDetailsUseCase: new GetClientDetailsUseCase(
      trainerRepositories.userRepository,
      trainerRepositories.healthMetricsRepository,
      trainerRepositories.slotRepository
   ),
   trainerCreateSlotUseCase:new TrainerCreateSlotUseCase(
    trainerRepositories.slotRepository,
    jobScheduler,
   notificationServiceProxy
   ),
   trainerEditSlotUseCase:new TrainerEditSlotUseCase(
      trainerRepositories.slotRepository,
      jobScheduler,
      notificationServiceProxy
   ),
   trainerCancelSlotUseCase:new TrainerCancelSlotUseCase(
      trainerRepositories.slotRepository,
      jobScheduler,
      notificationServiceProxy
   ),
   getPersonalUserUsecase:new GetTrainerOneOnOneUserUseCase(
      trainerRepositories.slotRepository
   ),
   getGroupUsersUseCase: new GetTrainerGroupUserUseCase(
      trainerRepositories.slotRepository
   ),
   getTrainerUpcomingSlotsUSeCase: new GetTrainerUpcomingSlotsUseCase(
      trainerRepositories.slotRepository
   ),
    getTrainerDashboardUseCase:new GetTrainerDashboardUseCase(
       trainerRepositories.slotRepository,
       trainerRepositories.trainerRepository,
       trainerRepositories.transactionRepository
    ),
   getTrinerProfileUseCase:new GetTrainerProfileUseCase(
    trainerRepositories.userRepository,
    trainerRepositories.trainerRepository,
    trainerRepositories.specializationRepository
   ),
   uploadTrainerImageUseCase: new UploadTrainerImageUseCase(
      trainerRepositories.userRepository,
      storageProvider

   ),
   updateTrainerProfileUseCase :new UpdateTrainerProfileUseCase(
      trainerRepositories.userRepository,
      trainerRepositories.trainerRepository
   ),
   trainerChangePasswordUseCase:new ChangePasswordUseCase(
      trainerRepositories.userRepository,
      passwordHasher
   ),
   getTrainerWalletUseCase: new GetTrainerWalletUseCase(
      trainerRepositories.trainerRepository,
      trainerRepositories.transactionRepository
   ),
   requestPayoutUseCase: new RequestPayoutUseCase(
      trainerRepositories.trainerRepository,
      trainerRepositories.transactionRepository
   )
};