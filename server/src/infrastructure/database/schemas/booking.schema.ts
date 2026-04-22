import { AttendanceStatus } from "@/domain/constants/session.constants";
import { Schema } from "mongoose";

export const BookingSchema = new Schema({
    slotId: {
        type: Schema.Types.ObjectId,
        ref: "Slot",
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    cumulativeMinutes: {
        type: Number,
        default: 0
    },
    lastJoinedAt: {
        type: Date
    },
    attendanceStatus: {
        type: String,
        enum: Object.values(AttendanceStatus),
        default: AttendanceStatus.PENDING
    }
}, { timestamps: true });

BookingSchema.index({ slotId: 1, userId: 1 }, { unique: true });
