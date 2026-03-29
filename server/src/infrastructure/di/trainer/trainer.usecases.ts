import { TrainerCreateSlotUseCase } from "@/application/usecases/slot/create-slot.usecase";
import { trainerRepositories } from "./trainer.repositories";
import { BullJobScheduler } from "@/infrastructure/providers/bullQueue/bull-job-scheduler";
import { TrainerCancelSlotUseCase, } from "@/application/usecases/slot/trainer-cancel-slot.usecase";
import { GetTrainerOneOnOneUserUseCase } from "@/application/usecases/slot/get-trainer-personalUserSlot";
import { GetTrainerGroupUserUseCase } from "@/application/usecases/slot/get-trainer-groupUsersSlot.usecase";
import { GetTrainerUpcomingSlotsUseCase } from "@/application/usecases/slot/get-trainer-upcomingSlot.usecase";
import { GetTrainerDashboardUseCase } from "@/application/usecases/trainer/get-trainerDashboard.usecase";

const jobScheduler = new BullJobScheduler();

export const trainerUsecase ={
   trainerCreateSlotUseCase:new TrainerCreateSlotUseCase(
    trainerRepositories.slotRepository,
    jobScheduler

   ),
   trainerCancelSlotUseCase:new TrainerCancelSlotUseCase(
      trainerRepositories.slotRepository,
      jobScheduler
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
      trainerRepositories.slotRepository
   )
};