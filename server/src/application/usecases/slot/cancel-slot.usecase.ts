import { CancelBookingRequestDTO } from "@/application/dto/slot/request/cancel-slot.dto";
import { CancelBookingResponseDTO } from "@/application/dto/slot/response/cancel-slot";
import { IBaseUseCase } from "@/application/interfaces/base-usecase.interface";
import { SLOT_MESSAGES } from "@/domain/constants/messages.constants";
import { ISlotRepository } from "@/domain/interfaces/repositories/slot.repository";

export class CancelBookingUseCase implements IBaseUseCase<CancelBookingRequestDTO, CancelBookingResponseDTO> {
  constructor(private readonly _slotRepository: ISlotRepository) {}

  async execute(dto: CancelBookingRequestDTO): Promise<CancelBookingResponseDTO> {
    const slot = await this._slotRepository.findById(dto.slotId);
    if (!slot) throw new Error("Slot not found.");

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

    return { 
    
      message: SLOT_MESSAGES.BOOKING_CANCELEED_SUCCESS
    };
  }
}