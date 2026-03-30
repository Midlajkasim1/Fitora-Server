import { TrainerSlotController } from "@/presentation/controllers/user/trainer-slot.controller";
import { trainerUsecase } from "./trainer.usecases";
import { TrainerController } from "@/presentation/controllers/user/trainer.controller";



export const trainerController ={
   trainerController:new TrainerController(
     trainerUsecase.getTrainerDashboardUseCase
   ),
   trainerSlotController: new TrainerSlotController(
    trainerUsecase.trainerCreateSlotUseCase,
    trainerUsecase.trainerEditSlotUseCase,
    trainerUsecase.trainerCancelSlotUseCase,
    trainerUsecase.getPersonalUserUsecase,
    trainerUsecase.getGroupUsersUseCase,
    trainerUsecase.getTrainerUpcomingSlotsUSeCase
   ),
   

};