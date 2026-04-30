import { IBookingRepository } from "@/domain/interfaces/repositories/booking.repository";
import { ISlotRepository } from "@/domain/interfaces/repositories/slot.repository";
import { AttendanceStatus, SlotStatus } from "@/domain/constants/session.constants";

import { IBaseUseCase } from "@/application/interfaces/base-usecase.interface";
import { SessionAccessStateRequestDTO } from "@/application/dto/video/request/get-session-access-state.dto";
import { SessionAccessStateResponseDTO } from "@/application/dto/video/response/get-session-access-state.dto";

export class GetSessionAccessStateUseCase implements IBaseUseCase<SessionAccessStateRequestDTO, SessionAccessStateResponseDTO> {
    constructor(
        private readonly _slotRepository: ISlotRepository,
        private readonly _bookingRepository: IBookingRepository
    ) {}

    async execute(dto: SessionAccessStateRequestDTO): Promise<SessionAccessStateResponseDTO> {
        const { slotId, userId } = dto;
        const slot = await this._slotRepository.findById(slotId);
        const booking = await this._bookingRepository.findBySlotIdAndUserId(slotId, userId);

        if (!slot || !booking) {
            return { showReview: false, canJoin: false };
        }

        const isLive = slot.status === SlotStatus.LIVE;
        const showReview = true;
        const canJoin = isLive && booking.attendanceStatus !== AttendanceStatus.COMPLETED;


        return {
            showReview,
            canJoin,
            bookingId: booking.id,
            reportedId: slot.trainerId.toString()
        };


    }
}
