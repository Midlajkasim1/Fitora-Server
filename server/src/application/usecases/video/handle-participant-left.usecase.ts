import { IBookingRepository } from "@/domain/interfaces/repositories/booking.repository";
import { AttendanceStatus, MIN_SUCCESS_THRESHOLD } from "@/domain/constants/session.constants";
import { BookingEntity } from "@/domain/entities/slot/booking.entity";

export interface ParticipantLeftRequest {
    slotId: string;
    userId: string;
}

export class HandleParticipantLeftUseCase {
    constructor(private readonly _bookingRepository: IBookingRepository) {}

    async execute(request: ParticipantLeftRequest): Promise<void> {
        const { slotId, userId } = request;
        const booking = await this._bookingRepository.findBySlotIdAndUserId(slotId, userId);
        
        if (booking && booking.lastJoinedAt) {
            const now = new Date();
            const durationMs = now.getTime() - booking.lastJoinedAt.getTime();
            const durationMinutes = durationMs / (1000 * 60);
            
            const newCumulativeMinutes = booking.cumulativeMinutes + durationMinutes;
            const updates: Partial<BookingEntity> = {
                cumulativeMinutes: newCumulativeMinutes,
                lastJoinedAt: null as unknown as Date // Casting null to Date for Partial
            };

            if (newCumulativeMinutes >= MIN_SUCCESS_THRESHOLD && booking.attendanceStatus === AttendanceStatus.PENDING) {
                updates.attendanceStatus = AttendanceStatus.ATTENDED;
            }

            await this._bookingRepository.updateAttendance(booking.id!, updates);
        }
    }
}
