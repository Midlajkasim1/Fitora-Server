import { IBookingRepository } from "@/domain/interfaces/repositories/booking.repository";

export interface ParticipantJoinedRequest {
    slotId: string;
    userId: string;
}

export class HandleParticipantJoinedUseCase {
    constructor(private readonly _bookingRepository: IBookingRepository) {}

    async execute(request: ParticipantJoinedRequest): Promise<void> {
        const { slotId, userId } = request;
        const booking = await this._bookingRepository.findBySlotIdAndUserId(slotId, userId);
        
        if (booking) {
            await this._bookingRepository.updateAttendance(booking.id!, {
                lastJoinedAt: new Date()
            });
        }
    }
}
