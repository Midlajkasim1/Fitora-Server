import { ReportStatus, ReportType } from "@/domain/constants/report.constants";
import { Schema } from "mongoose";

export const ReportSchema = new Schema({
    reporterId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },
    reportedId: {
        type: Schema.Types.ObjectId, // Could be User, Trainer, or Slot
        required: true,
        index: true
    },
    type: {
        type: String,
        enum: Object.values(ReportType),
        required: true,
        index: true
    },
    status: {
        type: String,
        enum: Object.values(ReportStatus),
        default: ReportStatus.PENDING,
        index: true
    },
    description: {
        type: String,
        required: true
    },
    resolutionNotes: {
        type: String
    }
}, {
    timestamps: true,
    versionKey: false
});
