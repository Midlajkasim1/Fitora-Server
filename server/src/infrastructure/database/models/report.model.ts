import { model } from "mongoose";
import { ReportSchema } from "../schemas/report.schema";

export const ReportModel = model("Report", ReportSchema);
