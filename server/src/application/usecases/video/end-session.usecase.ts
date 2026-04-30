import { IBookingRepository } from "@/domain/interfaces/repositories/booking.repository";
import { ISlotRepository } from "@/domain/interfaces/repositories/slot.repository";
import { AttendanceStatus, SlotStatus, MIN_SUCCESS_THRESHOLD } from "@/domain/constants/session.constants";
import { ISocketEmitter } from "@/domain/interfaces/services/socket-emitter.interface";
import { HandleParticipantLeftUseCase } from "./handle-participant-left.usecase";
import { ExecuteSessionPayoutUseCase } from "./execute-session-payout.usecase";
import { IBaseUseCase } from "@/application/interfaces/base-usecase.interface";
import { EndSessionRequestDTO } from "@/application/dto/video/request/end-session.dto";
import { EndSessionResponseDTO } from "@/application/dto/video/response/end-session.dto";
import { SESSION_MESSAGES, VIDEO_MESSAGES } from "@/domain/constants/messages.constants";


export class EndSessionUseCase implements IBaseUseCase<EndSessionRequestDTO, EndSessionResponseDTO> {
    constructor(
        private readonly _slotRepository: ISlotRepository,
        private readonly _bookingRepository: IBookingRepository,
        private readonly _socketEmitter: ISocketEmitter,
        private readonly _handleParticipantLeftUseCase: HandleParticipantLeftUseCase,
        private readonly _executeSessionPayoutUseCase: ExecuteSessionPayoutUseCase
    ) {}

    async execute(dto: EndSessionRequestDTO): Promise<EndSessionResponseDTO> {
        const { slotId, trainerId } = dto;
        const slot = await this._slotRepository.findById(slotId);
        
        if (!slot) {
            throw new Error(SESSION_MESSAGES.SESSION_NOT_FOUND);
        }

        if (slot.trainerId.toString() !== trainerId) {
            throw new Error(SESSION_MESSAGES.ONLY_TRAINER_CAN_END);
        }

        const bookings = await this._bookingRepository.findBySlotId(slotId);
        for (const booking of bookings) {
            if (booking.lastJoinedAt) {
                await this._handleParticipantLeftUseCase.execute({
                    slotId,
                    userId: booking.userId
                });
            }
        }


        const updatedBookings = await this._bookingRepository.findBySlotId(slotId);
        let hasClientsJoined = false;
        
        for (const booking of updatedBookings) {
            if (booking.cumulativeMinutes > 0 || booking.lastJoinedAt) {
                hasClientsJoined = true;
            }

            if (booking.attendanceStatus === AttendanceStatus.ATTENDED &&
                booking.cumulativeMinutes * 60 >= MIN_SUCCESS_THRESHOLD) {
                await this._bookingRepository.updateAttendance(booking.id!, {
                    attendanceStatus: AttendanceStatus.COMPLETED
                });
            }
        }

        await this._executeSessionPayoutUseCase.execute({ slotId });

        if (hasClientsJoined) {
            await this._slotRepository.updateStatus(slotId, SlotStatus.COMPLETED);
        } else {
            await this._slotRepository.updateStatus(slotId, SlotStatus.CANCELLED);
        }

        this._socketEmitter.emitToRoom(slotId, "SESSION_FINISHED", { 
            slotId,
            message: "The session has concluded. Thank you for participating!"
        });

        return { message: VIDEO_MESSAGES.SESSION_ENDED };
    }
}
