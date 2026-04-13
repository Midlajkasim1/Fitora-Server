import { CreateSlotRequestDTO } from "@/application/dto/slot/request/create-slot.dto";
import { CreateSlotResponseDTO } from "@/application/dto/slot/response/create-slot.dto";
import { IBaseUseCase } from "@/application/interfaces/base-usecase.interface";
import { NOTIFICATION_TEMPLATES, SLOT_MESSAGES } from "@/domain/constants/messages.constants";
import { NotificationType } from "@/domain/constants/notification.constants";
import { SlotEntity } from "@/domain/entities/slot/slot.entity";
import { ISlotRepository } from "@/domain/interfaces/repositories/slot.repository";
import { IJobScheduler } from "@/domain/interfaces/services/job-scheduler.interface";
import { INotificationService } from "@/domain/interfaces/services/notification-service.interface";


export class TrainerCreateSlotUseCase implements IBaseUseCase<CreateSlotRequestDTO,CreateSlotResponseDTO>{
    constructor(
        private readonly _slotRespository:ISlotRepository,
        private readonly _jobScheduler:IJobScheduler,
        private readonly _notificationService: INotificationService
    ){}
  async  execute(dto: CreateSlotRequestDTO): Promise<CreateSlotResponseDTO> {
         const start = new Date(dto.startTime);
         const end = new Date(dto.endTime);
         const now = new Date();
        if(start<=now){
            throw new Error(SLOT_MESSAGES.CANNOT_CREATE_SLOT_IN_PAST);
        }
        if(end<=start){
            throw new Error(SLOT_MESSAGES.SLOT_TIME_MUST_BE_AFTER_START_TIME);
        }
    const durationMs = end.getTime() - start.getTime();
    const durationMin = durationMs / (1000 *60);
    if(durationMin !==60){
        throw new Error(SLOT_MESSAGES.SESSION_SLOT_MUST_HOUR);
    }
    if (start.toDateString() !== end.toDateString()) {
        throw new Error(SLOT_MESSAGES.SINGLE_SESSION_CANNOT_SPAN_ACROSS_MULTIPLE_DAYS);
    }
    const overlapping = await this._slotRespository.findOverlappingSlot(
        dto.trainerId,
        dto.startTime,
        dto.endTime
    );
    if(overlapping){
        throw new Error(SLOT_MESSAGES.ALREADY_HAVE_A_SESSION_SCHEDULED_THAT_OVERLAPS_WITH_TIME);
    }
    const slot = SlotEntity.create({
        trainerId:dto.trainerId,
        startTime:dto.startTime,
        endTime:dto.endTime,
        type:dto.type,
        capacity:dto.capacity,
        

    });
    const savedSlot = await this._slotRespository.create(slot);
    const waitTime = new Date(savedSlot.endTime).getTime() -Date.now();
    await this._jobScheduler.scheduleSessionExpiry(savedSlot.id!,waitTime);


    await this._notificationService.notify(dto.trainerId, {
      title: NOTIFICATION_TEMPLATES.SLOT_CREATED_TRAINER.TITLE,
      message: NOTIFICATION_TEMPLATES.SLOT_CREATED_TRAINER.MESSAGE(dto.type,start.toLocaleDateString(),start.toLocaleTimeString()),
      type: NotificationType.SLOT_CREATED
    });
    
    return new CreateSlotResponseDTO({
        id:savedSlot.id!,
        trainerId:savedSlot.trainerId,
        startTime:savedSlot.startTime,
        endTime:savedSlot.endTime,
        type:savedSlot.type,
        capacity:savedSlot.capacity,
        status:savedSlot.status,
        message:SLOT_MESSAGES.SLOT_CREATED_SUCESSFULLY
    });
        
    }
}