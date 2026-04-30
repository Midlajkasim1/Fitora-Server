import { IBookingRepository } from "@/domain/interfaces/repositories/booking.repository";
import { ISubscriptionRepository } from "@/domain/interfaces/repositories/subscription.repository";
import { AttendanceStatus } from "@/domain/constants/session.constants";
import { IBaseUseCase } from "@/application/interfaces/base-usecase.interface";
import { HandleParticipantJoinedRequestDTO } from "@/application/dto/video/request/handle-participant-joined.dto";

export class HandleParticipantJoinedUseCase implements IBaseUseCase<HandleParticipantJoinedRequestDTO, void> {
    constructor(
        private readonly _bookingRepository: IBookingRepository,
        private readonly _subscriptionRepository: ISubscriptionRepository
    ) {}

    async execute(dto: HandleParticipantJoinedRequestDTO): Promise<void> {
        const { slotId, userId } = dto;
        
        const booking = await this._bookingRepository.findBySlotIdAndUserId(slotId, userId);
        
        if (booking) {
            if (booking.attendanceStatus === AttendanceStatus.PENDING) {
                const subscription = await this._subscriptionRepository.findActiveByUserId(userId);
                if (subscription) {
                    await this._subscriptionRepository.incrementUsedCredit(subscription.id!);
                }
            }

            await this._bookingRepository.updateAttendance(booking.id!, {
                lastJoinedAt: new Date(),
                attendanceStatus: AttendanceStatus.ATTENDED
            });
        }
    }
}
