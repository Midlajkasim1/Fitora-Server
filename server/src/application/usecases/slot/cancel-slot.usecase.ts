import { CancelBookingRequestDTO } from "@/application/dto/slot/request/cancel-slot.dto";
import { CancelBookingResponseDTO } from "@/application/dto/slot/response/cancel-slot";
import { IBaseUseCase } from "@/application/interfaces/base-usecase.interface";
import { SLOT_MESSAGES } from "@/domain/constants/messages.constants";
import { NotificationType } from "@/domain/constants/notification.constants";
import { ISlotRepository } from "@/domain/interfaces/repositories/slot.repository";
import { INotificationService } from "@/domain/interfaces/services/notification-service.interface";

export class CancelBookingUseCase implements IBaseUseCase<CancelBookingRequestDTO, CancelBookingResponseDTO> {
  constructor(
    private readonly _slotRepository: ISlotRepository,
    private readonly _notificationService: INotificationService


  ) {}

  async execute(dto: CancelBookingRequestDTO): Promise<CancelBookingResponseDTO> {
    const slot = await this._slotRepository.findById(dto.slotId);
    if (!slot) throw new Error(SLOT_MESSAGES.SLOT_NOT_FOUND);

    const now = new Date();
    const startTime = new Date(slot.startTime);
    const lefthour = (startTime.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (lefthour < 0) {
      throw new Error(SLOT_MESSAGES.CANNOT_CANCEL_ALREADY_START_SESSION);
    }

   
    if (lefthour < 24) {
     throw new Error(SLOT_MESSAGES.ONLY_CANCEL_BEFORE_24_HOUR);
    }

    const success = await this._slotRepository.cancelBooking(dto.slotId, dto.userId);
    if (!success) throw new Error(SLOT_MESSAGES.FAILED_TO_CANCEL);
    const sessionDate = new Date(slot.startTime).toLocaleDateString();
    const sessionTime = new Date(slot.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    await this._notificationService.notify(slot.trainerId, {
      title: "Booking Cancelled ⚠️",
      message: `A client cancelled their booking for the ${slot.type} session on ${sessionDate} at ${sessionTime}. The slot is now available for others.`,
      type: NotificationType.SLOT_CANCELLED
    });
    return { 
    
      message: SLOT_MESSAGES.BOOKING_CANCELEED_SUCCESS
    };
  }
}