import { TrainerCancelSlotRequestDTO } from "@/application/dto/slot/request/trainer-cancel-slot.dto";
import { TrainerCancelSlotResponseDTO } from "@/application/dto/slot/response/trainer-cancel-slot";
import { IBaseUseCase } from "@/application/interfaces/base-usecase.interface";
import { SLOT_MESSAGES } from "@/domain/constants/messages.constants";
import { SlotStatus } from "@/domain/constants/session.constants";
import { ISlotRepository } from "@/domain/interfaces/repositories/slot.repository";
import { IJobScheduler } from "@/domain/interfaces/services/job-scheduler.interface";


export class TrainerCancelSlotUseCase implements IBaseUseCase<TrainerCancelSlotRequestDTO,TrainerCancelSlotResponseDTO>{
    constructor(
        private readonly _slotRepostory:ISlotRepository,
        private readonly _jobScheduler:IJobScheduler
    ){}
    async execute(dto: TrainerCancelSlotRequestDTO): Promise<TrainerCancelSlotResponseDTO> {
        const slot = await this._slotRepostory.findById(dto.slotId);
        if(!slot){
            throw new Error(SLOT_MESSAGES.SLOT_NOT_FOUND);
        }
        if(slot.trainerId !== dto.trainerId){
            throw new Error(SLOT_MESSAGES.TRAINER_WHO_CREATE_SLOT_CAN_CANCEL);
        }
       const now = new Date();
      if (new Date(slot.startTime) <= now) {
      throw new Error(SLOT_MESSAGES.CANNOT_CANCEL_ALREADY_START_SESSION);
    }
    await this._slotRepostory.updateStatus(dto.slotId,SlotStatus.CANCELLED);
    await this._jobScheduler.cancelScheduledExpiry(dto.slotId);
     return {
        message:SLOT_MESSAGES.TRAINER_CANCEL_SLOT_SUCCESSFULLY
     };
    }
}