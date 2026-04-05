import { TrainerCancelSlotRequestDTO } from "@/application/dto/slot/request/trainer-cancel-slot.dto";
import { TrainerCancelSlotResponseDTO } from "@/application/dto/slot/response/trainer-cancel-slot";
import { IBaseUseCase } from "@/application/interfaces/base-usecase.interface";
import { SLOT_MESSAGES } from "@/domain/constants/messages.constants";
import { NotificationType } from "@/domain/constants/notification.constants";
import { SlotStatus } from "@/domain/constants/session.constants";
import { ISlotRepository } from "@/domain/interfaces/repositories/slot.repository";
import { IJobScheduler } from "@/domain/interfaces/services/job-scheduler.interface";
import { INotificationService } from "@/domain/interfaces/services/notification-service.interface";


export class TrainerCancelSlotUseCase implements IBaseUseCase<TrainerCancelSlotRequestDTO,TrainerCancelSlotResponseDTO>{
    constructor(
        private readonly _slotRepostory:ISlotRepository,
        private readonly _jobScheduler:IJobScheduler,
        private readonly _notificationService:INotificationService
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
        const bookedUsers = slot.participants || [];

        if (bookedUsers.length > 0) {
            const sessionDate = new Date(slot.startTime).toLocaleDateString();
            const sessionTime = new Date(slot.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

            for (const userId of bookedUsers) {
                await this._notificationService.notify(userId, {
                    title: "Session Cancelled ❌",
                    message: `The trainer has cancelled the ${slot.type} session scheduled for ${sessionDate} at ${sessionTime}. Your credits will be managed accordingly.`,
                    type: NotificationType.SLOT_CANCELLED
                });
            }
        }
     return {
        message:SLOT_MESSAGES.TRAINER_CANCEL_SLOT_SUCCESSFULLY
     };
    }
}