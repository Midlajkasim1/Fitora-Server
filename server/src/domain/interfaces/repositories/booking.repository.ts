import { BookingEntity } from "@/domain/entities/slot/booking.entity";
import { IBaseRepository } from "./base.repository";

export interface IBookingRepository extends IBaseRepository<BookingEntity> {
    findBySlotIdAndUserId(slotId: string, userId: string): Promise<BookingEntity | null>;
    findBySlotId(slotId: string): Promise<BookingEntity[]>;
    updateAttendance(bookingId: string, data: Partial<BookingEntity>): Promise<void>;
}
