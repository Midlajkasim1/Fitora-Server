import { BookingEntity, IBookingProps } from "@/domain/entities/slot/booking.entity";
import { IBaseRepository } from "./base.repository";
import { ClientSession } from "mongoose";

export interface IUserActivityStats {
    totalSessionsAttended: number;
    totalMinutes: number;
    sessionsThisWeek: number;
    sessionsThisMonth: number;
    attendedDays: string[];
}

export interface IBookingRepository extends IBaseRepository<BookingEntity> {
    findBySlotIdAndUserId(slotId: string, userId: string): Promise<BookingEntity | null>;
    findBySlotId(slotId: string, session?: ClientSession): Promise<BookingEntity[]>;
    updateAttendance(bookingId: string, data: Partial<IBookingProps>, session?: ClientSession): Promise<void>;
    getUserDailyProgress(userId: string, days: number): Promise<{ day: string, value: number }[]>;
    getUserSessionsPerDay(userId: string, days: number): Promise<{ day: string, value: number }[]>;
    getUserActivityStats(userId: string): Promise<IUserActivityStats>;
}
