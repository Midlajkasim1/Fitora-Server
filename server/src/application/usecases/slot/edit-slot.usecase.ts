import { TrainerEditSlotRequestDTO } from "@/application/dto/slot/request/trainer-edit-slot.dto";
import { EditSlotResponseDTO } from "@/application/dto/slot/response/trainer-edit-slot.dto";
import { IBaseUseCase } from "@/application/interfaces/base-usecase.interface";
import { NOTIFICATION_MESSAGES, NOTIFICATION_TEMPLATES, SLOT_MESSAGES } from "@/domain/constants/messages.constants";
import { NotificationType } from "@/domain/constants/notification.constants";
import { SlotStatus } from "@/domain/constants/session.constants";
import { ISlotRepository } from "@/domain/interfaces/repositories/slot.repository";
import { IJobScheduler } from "@/domain/interfaces/services/job-scheduler.interface";
import { INotificationService } from "@/domain/interfaces/services/notification-service.interface";


export class TrainerEditSlotUseCase implements IBaseUseCase<TrainerEditSlotRequestDTO, EditSlotResponseDTO> {
    constructor(
        private readonly _slotRespository: ISlotRepository,
        private readonly _jobScheduler: IJobScheduler,
        private readonly _notificationService: INotificationService
    ) { }
    async execute(dto: TrainerEditSlotRequestDTO): Promise<EditSlotResponseDTO> {
        const start = new Date(dto.startTime);
        const end = new Date(dto.endTime);
        const now = new Date();
        if (start <= now) {
            throw new Error(SLOT_MESSAGES.CANNOT_CREATE_SLOT_IN_PAST);
        }
        if (end <= start) {
            throw new Error(SLOT_MESSAGES.SLOT_TIME_MUST_BE_AFTER_START_TIME);
        }
        const durationMs = end.getTime() - start.getTime();
        const durationMin = durationMs / (1000 * 60);
        if (durationMin !== 60) {
            throw new Error(SLOT_MESSAGES.SESSION_SLOT_MUST_HOUR);
        }

        const isSameDay = start.toDateString() === end.toDateString();
        const isMidnightNextDay = end.getHours() === 0 && end.getMinutes() === 0 && (end.getTime() - start.getTime() === 3600000);

        if (!isSameDay && !isMidnightNextDay) {
            throw new Error(SLOT_MESSAGES.SINGLE_SESSION_CANNOT_SPAN_ACROSS_MULTIPLE_DAYS);
        }
        const overlapping = await this._slotRespository.checkAvaliability(
            dto.trainerId,
            dto.startTime,
            dto.endTime,
            dto.slotId
        );
        if (overlapping) {
            throw new Error(SLOT_MESSAGES.ALREADY_HAVE_A_SESSION_SCHEDULED_THAT_OVERLAPS_WITH_TIME);
        }
        const existingSlot = await this._slotRespository.findById(dto.slotId);
        if (!existingSlot) throw new Error("Slot not found");

        if (existingSlot.status !== SlotStatus.AVAILABLE) {
            throw new Error(SLOT_MESSAGES.CANNOT_EDIT_ALREADY_BOOKED_SLOT);
        }

        existingSlot.update({
            startTime: dto.startTime,
            endTime: dto.endTime,
            type: dto.type,
            capacity: dto.capacity
        });

        const updatedSlot = await this._slotRespository.update(dto.slotId, {
            startTime: dto.startTime,
            endTime: dto.endTime,
            type: dto.type,
            capacity: dto.capacity
        });
        if (!updatedSlot) throw new Error("Failed to update slot");

        const participants = existingSlot.participants || [];

        if (participants.length > 0) {
            const startTimeString = new Date(updatedSlot.startTime).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit"
            });

            for (const userId of participants) {
                await this._notificationService.notify(userId, {
                    title: NOTIFICATION_TEMPLATES.SLOT_UPDATED_PARTICIPANT.TITLE,
                    message: NOTIFICATION_TEMPLATES.SLOT_UPDATED_PARTICIPANT.MESSAGE(updatedSlot.type,startTimeString),
                    type: NotificationType.SLOT_CREATED 
                });
            }
        }
        await this._jobScheduler.cancelScheduledExpiry(updatedSlot.id!);
        const waitTime = new Date(updatedSlot.endTime).getTime() - Date.now();
        if (waitTime > 0) {
            await this._jobScheduler.scheduleSessionExpiry(updatedSlot.id!, waitTime);
        }


        return {
            id: updatedSlot.id!,
            startTime: updatedSlot.startTime,
            endTime: updatedSlot.endTime,
            type: updatedSlot.type,
            capacity: updatedSlot.capacity,
            status: updatedSlot.status,
            message: NOTIFICATION_MESSAGES.SLOT_UPDATED_SUCESS
        };
    }
}