import { IBookingRepository } from "@/domain/interfaces/repositories/booking.repository";
import { ISlotRepository } from "@/domain/interfaces/repositories/slot.repository";
import { AttendanceStatus, SlotStatus } from "@/domain/constants/session.constants";
import { ISocketEmitter } from "@/domain/interfaces/services/socket-emitter.interface";
import { HandleParticipantLeftUseCase } from "./handle-participant-left.usecase";
import { ExecuteSessionPayoutUseCase } from "./execute-session-payout.usecase";

export interface EndSessionRequest {
    slotId: string;
    trainerId: string;
}

export class EndSessionUseCase {
    constructor(
        private readonly _slotRepository: ISlotRepository,
        private readonly _bookingRepository: IBookingRepository,
        private readonly _socketEmitter: ISocketEmitter,
        private readonly _handleParticipantLeftUseCase: HandleParticipantLeftUseCase,
        private readonly _executeSessionPayoutUseCase: ExecuteSessionPayoutUseCase
    ) {}

    async execute(request: EndSessionRequest): Promise<void> {
        const { slotId, trainerId } = request;
        const slot = await this._slotRepository.findById(slotId);
        
        if (!slot) {
            throw new Error("Session not found");
        }

        // Verify trainer - comparing string to string (or ObjectId string)
        if (slot.trainerId.toString() !== trainerId) {
            throw new Error("Only the assigned trainer can end this session");
        }

        // 1. Handle participants still in the call (final duration calculation before closing)
        const bookings = await this._bookingRepository.findBySlotId(slotId);
        for (const booking of bookings) {
            if (booking.lastJoinedAt) {
                // Someone is still in the call, trigger HandleParticipantLeft to calculate their final time
                await this._handleParticipantLeftUseCase.execute({
                    slotId,
                    userId: booking.userId
                });
            }
        }

        // 2. Update bookings: those who joined at any point should now be 'COMPLETED'
        const updatedBookings = await this._bookingRepository.findBySlotId(slotId);
        for (const booking of updatedBookings) {
            // If they attended (at least one join session) or reached the threshold, mark as COMPLETED
            const hasJoinedAtAnyPoint = booking.cumulativeMinutes > 0;
            if (booking.attendanceStatus === AttendanceStatus.ATTENDED || 
               (booking.attendanceStatus === AttendanceStatus.PENDING && hasJoinedAtAnyPoint)) {
                await this._bookingRepository.updateAttendance(booking.id!, {
                    attendanceStatus: AttendanceStatus.COMPLETED
                });
            }
        }


        // 3. Update Slot status to COMPLETED
        await this._slotRepository.updateStatus(slotId, SlotStatus.COMPLETED);

        // 4. Trigger ExecuteSessionPayoutUseCase (Financial Distribution)
        await this._executeSessionPayoutUseCase.execute(slotId);

        // 5. Broadcast SESSION_FINISHED via RedisEmitter to force-redirect all participants
        this._socketEmitter.emitToRoom(slotId, "SESSION_FINISHED", { 
            slotId,
            message: "The session has concluded. Thank you for participating!"
        });
    }
}
