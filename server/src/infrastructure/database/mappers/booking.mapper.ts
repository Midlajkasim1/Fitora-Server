import { BookingEntity } from "@/domain/entities/slot/booking.entity";
import { IMapper } from "@/domain/interfaces/services/mapper.interface";
import { Types } from "mongoose";
import { AttendanceStatus } from "@/domain/constants/session.constants";

export interface IBookingDocument {
    _id: Types.ObjectId;
    slotId: Types.ObjectId;
    userId: Types.ObjectId;
    cumulativeMinutes: number;
    lastJoinedAt?: Date;
    attendanceStatus: AttendanceStatus;
    isPayoutProcessed: boolean;
    creditValueAtPurchase: number;
    sessionType: string;
    createdAt: Date;
    updatedAt: Date;
}

export class BookingMapper implements IMapper<BookingEntity, IBookingDocument> {
    toEntity(doc: IBookingDocument): BookingEntity {
        return new BookingEntity({
            id: doc._id.toString(),
            slotId: doc.slotId.toString(),
            userId: doc.userId.toString(),
            cumulativeMinutes: doc.cumulativeMinutes,
            lastJoinedAt: doc.lastJoinedAt,
            attendanceStatus: doc.attendanceStatus,
            isPayoutProcessed: doc.isPayoutProcessed,
            creditValueAtPurchase: doc.creditValueAtPurchase,
            sessionType: doc.sessionType
        });
    }

    toMongo(entity: BookingEntity): Partial<IBookingDocument> {
        const doc: Partial<IBookingDocument> = {
            slotId: new Types.ObjectId(entity.slotId),
            userId: new Types.ObjectId(entity.userId),
            cumulativeMinutes: entity.cumulativeMinutes,
            attendanceStatus: entity.attendanceStatus,
            isPayoutProcessed: entity.isPayoutProcessed,
            creditValueAtPurchase: entity.creditValueAtPurchase,
            sessionType: entity.sessionType
        };
        if (entity.lastJoinedAt) {
            doc.lastJoinedAt = entity.lastJoinedAt;
        }
        return doc;
    }
}
