import { BookingEntity, IBookingProps } from "@/domain/entities/slot/booking.entity";
import { IBookingRepository, IUserActivityStats } from "@/domain/interfaces/repositories/booking.repository";
import { BookingMapper, IBookingDocument } from "../mappers/booking.mapper";
import { BookingModel } from "../models/booking.model";
import { Types, Model, ClientSession } from "mongoose";
import { AttendanceStatus } from "@/domain/constants/session.constants";
import { BaseRepository } from "./base.repository";

export class BookingRepository extends BaseRepository<BookingEntity, IBookingDocument> implements IBookingRepository {
    constructor(private readonly _mapper: BookingMapper) {
        super(BookingModel as unknown as Model<IBookingDocument>, _mapper);
    }

    async findBySlotIdAndUserId(slotId: string, userId: string): Promise<BookingEntity | null> {
        const doc = await BookingModel.findOne({
            slotId: new Types.ObjectId(slotId),
            userId: new Types.ObjectId(userId)
        }).lean<IBookingDocument>();
        return doc ? this._mapper.toEntity(doc) : null;
    }

    async findBySlotId(slotId: string, session?: ClientSession): Promise<BookingEntity[]> {
        const docs = await BookingModel.find({ slotId: new Types.ObjectId(slotId) }).session(session ?? null).lean<IBookingDocument[]>();
        return docs.map(doc => this._mapper.toEntity(doc));
    }

    async updateAttendance(bookingId: string, data: Partial<IBookingProps>, session?: ClientSession): Promise<void> {
        const updateDoc: Record<string, unknown> = {};
        if (data.cumulativeMinutes !== undefined) updateDoc.cumulativeMinutes = data.cumulativeMinutes;
        if (data.lastJoinedAt !== undefined) updateDoc.lastJoinedAt = data.lastJoinedAt;
        if (data.attendanceStatus !== undefined) updateDoc.attendanceStatus = data.attendanceStatus;
        if (data.isPayoutProcessed !== undefined) updateDoc.isPayoutProcessed = data.isPayoutProcessed;
        if (data.creditValueAtPurchase !== undefined) updateDoc.creditValueAtPurchase = data.creditValueAtPurchase;
        if (data.sessionType !== undefined) updateDoc.sessionType = data.sessionType;
        
        if (data.lastJoinedAt === null) updateDoc.lastJoinedAt = null;

        await BookingModel.findByIdAndUpdate(bookingId, { $set: updateDoc }, { session });
    }

    async getUserDailyProgress(userId: string, days: number): Promise<{ day: string, value: number }[]> {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days + 1);
        startDate.setHours(0, 0, 0, 0);

        const progress = await BookingModel.aggregate([
            {
                $match: {
                    userId: new Types.ObjectId(userId),
                    updatedAt: { $gte: startDate }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$updatedAt" } },
                    totalMinutes: { $sum: "$cumulativeMinutes" }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        const result: { day: string, value: number }[] = [];
        const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        
        for (let i = 0; i < days; i++) {
            const date = new Date();
            date.setDate(date.getDate() - (days - 1 - i));
            const dateStr = date.toISOString().split("T")[0];
            const dayName = dayNames[date.getDay()];
            
            const dayData = progress.find(p => p._id === dateStr);
            result.push({
                day: dayName,
                value: dayData ? Math.min(dayData.totalMinutes, 100) : 0
            });
        }

        return result;
    }

    async getUserSessionsPerDay(userId: string, days: number): Promise<{ day: string, value: number }[]> {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days + 1);
        startDate.setHours(0, 0, 0, 0);

        const counts = await BookingModel.aggregate([
            {
                $match: {
                    userId: new Types.ObjectId(userId),
                    attendanceStatus: { $in: [AttendanceStatus.ATTENDED, AttendanceStatus.COMPLETED] },
                    updatedAt: { $gte: startDate }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$updatedAt" } },
                    sessionCount: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        const result: { day: string, value: number }[] = [];
        const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

        for (let i = 0; i < days; i++) {
            const date = new Date();
            date.setDate(date.getDate() - (days - 1 - i));
            const dateStr = date.toISOString().split("T")[0];
            const dayName = dayNames[date.getDay()];
            const dayData = counts.find((c: { _id: string; sessionCount: number }) => c._id === dateStr);
            result.push({
                day: dayName,
                value: dayData ? Math.min(Math.round((dayData.sessionCount / 3) * 100), 100) : 0
            });
        }

        return result;
    }

    async getUserActivityStats(userId: string): Promise<IUserActivityStats> {

        const now = new Date();

        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        startOfWeek.setHours(0, 0, 0, 0);

        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const attendedStatuses = [AttendanceStatus.ATTENDED, AttendanceStatus.COMPLETED];

        // Total attended sessions and cumulative minutes
        const totalStats = await BookingModel.aggregate([
            {
                $match: {
                    userId: new Types.ObjectId(userId),
                    attendanceStatus: { $in: attendedStatuses }
                }
            },
            {
                $group: {
                    _id: null,
                    totalSessions: { $sum: 1 },
                    totalMinutes: { $sum: "$cumulativeMinutes" }
                }
            }
        ]);

        const sessionsThisWeek = await BookingModel.countDocuments({
            userId: new Types.ObjectId(userId),
            attendanceStatus: { $in: attendedStatuses },
            updatedAt: { $gte: startOfWeek }
        });

        const sessionsThisMonth = await BookingModel.countDocuments({
            userId: new Types.ObjectId(userId),
            attendanceStatus: { $in: attendedStatuses },
            updatedAt: { $gte: startOfMonth }
        });

        const sixtyDaysAgo = new Date();
        sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

        const attendedDaysData = await BookingModel.aggregate([
            {
                $match: {
                    userId: new Types.ObjectId(userId),
                    attendanceStatus: { $in: attendedStatuses },
                    updatedAt: { $gte: sixtyDaysAgo }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$updatedAt" } }
                }
            },
            { $sort: { _id: -1 } }
        ]);

        return {
            totalSessionsAttended: totalStats[0]?.totalSessions ?? 0,
            totalMinutes: Math.round(totalStats[0]?.totalMinutes ?? 0),
            sessionsThisWeek,
            sessionsThisMonth,
            attendedDays: attendedDaysData.map((d: { _id: string }) => d._id)
        };
    }
}
