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
    },
    isPayoutProcessed: {
        type: Boolean,
        default: false
    },
    creditValueAtPurchase: {
        type: Number, // Stored in Paise
        default: 0
    },
    sessionType: {
        type: String,
        enum: ["one_on_one", "group"],
        default: "group"
    }
}, { timestamps: true });

BookingSchema.index({ slotId: 1, userId: 1 }, { unique: true });
