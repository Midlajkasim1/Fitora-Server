import { BookingEntity } from "@/domain/entities/slot/booking.entity";
import { IBookingRepository } from "@/domain/interfaces/repositories/booking.repository";
import { BookingMapper, IBookingDocument } from "../mappers/booking.mapper";
import { BookingModel } from "../models/booking.model";
import { Types, Model } from "mongoose";
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

    async findBySlotId(slotId: string): Promise<BookingEntity[]> {
        const docs = await BookingModel.find({ slotId: new Types.ObjectId(slotId) }).lean<IBookingDocument[]>();
        return docs.map(doc => this._mapper.toEntity(doc));
    }

    async updateAttendance(bookingId: string, data: Partial<BookingEntity>): Promise<void> {
        const updateDoc: Record<string, unknown> = {};
        if (data.cumulativeMinutes !== undefined) updateDoc.cumulativeMinutes = data.cumulativeMinutes;
        if (data.lastJoinedAt !== undefined) updateDoc.lastJoinedAt = data.lastJoinedAt;
        if (data.attendanceStatus !== undefined) updateDoc.attendanceStatus = data.attendanceStatus;
        
        // Handle null/undefined for lastJoinedAt explicitly if needed (e.g. for clearing it)
        if (data.lastJoinedAt === null) updateDoc.lastJoinedAt = null;

        await BookingModel.findByIdAndUpdate(bookingId, { $set: updateDoc });
    }
}
