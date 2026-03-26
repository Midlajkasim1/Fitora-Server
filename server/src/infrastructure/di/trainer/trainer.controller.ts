import { TrainerSlotController } from "@/presentation/controllers/user/trainer-slot.controller";
import { trainerUsecase } from "./trainer.usecases";



export const trainerController ={
   trainerSlotController: new TrainerSlotController(
    trainerUsecase.trainerCreateSlotUseCase
   )
};