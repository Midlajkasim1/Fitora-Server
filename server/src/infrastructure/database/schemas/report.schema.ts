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
        type: Schema.Types.ObjectId, 
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
    },
    sessionId: {
        type: String,
        index: true
    }
}, {
    timestamps: true,
    versionKey: false
});
