import { IBookingRepository } from "@/domain/interfaces/repositories/booking.repository";
import { ISlotRepository } from "@/domain/interfaces/repositories/slot.repository";
import { AttendanceStatus, SlotStatus, MIN_SUCCESS_THRESHOLD } from "@/domain/constants/session.constants";

export interface SessionAccessStateRequest {
    slotId: string;
    userId: string;
}

export interface SessionAccessStateResponse {
    showReview: boolean;
    canJoin: boolean;
    bookingId?: string;
    reportedId?: string;
}



export class GetSessionAccessStateUseCase {
    constructor(
        private readonly _slotRepository: ISlotRepository,
        private readonly _bookingRepository: IBookingRepository
    ) {}

    async execute(request: SessionAccessStateRequest): Promise<SessionAccessStateResponse> {
        const { slotId, userId } = request;
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
