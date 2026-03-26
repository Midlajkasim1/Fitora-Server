import { TrainerCreateSlotUseCase } from "@/application/usecases/slot/create-slot.usecase";
import { trainerRepositories } from "./trainer.repositories";



export const trainerUsecase ={
   trainerCreateSlotUseCase:new TrainerCreateSlotUseCase(
    trainerRepositories.slotRepository
   )
};