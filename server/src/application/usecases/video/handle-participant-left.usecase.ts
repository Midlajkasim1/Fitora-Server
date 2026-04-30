import { IBookingRepository } from "@/domain/interfaces/repositories/booking.repository";
import { AttendanceStatus, MIN_SUCCESS_THRESHOLD } from "@/domain/constants/session.constants";
import { IBookingProps } from "@/domain/entities/slot/booking.entity";
import { IBaseUseCase } from "@/application/interfaces/base-usecase.interface";
import { HandleParticipantLeftRequestDTO } from "@/application/dto/video/request/handle-participant-left.dto";


export class HandleParticipantLeftUseCase implements IBaseUseCase<HandleParticipantLeftRequestDTO, void> {
    constructor(
        private readonly _bookingRepository: IBookingRepository
    ) {}

    async execute(dto: HandleParticipantLeftRequestDTO): Promise<void> {
        const { slotId, userId } = dto;
        const booking = await this._bookingRepository.findBySlotIdAndUserId(slotId, userId);
        
        if (booking && booking.lastJoinedAt) {
            const now = new Date();
            const durationMs      = now.getTime() - booking.lastJoinedAt.getTime();
            const durationMinutes = durationMs / (1000 * 60);
            
            const newCumulativeMinutes = booking.cumulativeMinutes + durationMinutes;
            const updates: Partial<IBookingProps> = {
                cumulativeMinutes: newCumulativeMinutes,
                lastJoinedAt: null       
            };

            if (newCumulativeMinutes * 60 >= MIN_SUCCESS_THRESHOLD) {
                updates.attendanceStatus = AttendanceStatus.COMPLETED;
            } 
            
            await this._bookingRepository.updateAttendance(booking.id!, updates);

        } 
    }
}
