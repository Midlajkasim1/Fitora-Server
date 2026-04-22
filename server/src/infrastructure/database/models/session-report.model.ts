import mongoose from "mongoose";
import { SessionReportSchema } from "../schemas/review/session-report.schema";

export const SessionReportModel = mongoose.model("SessionReport", SessionReportSchema, "session_reports");
