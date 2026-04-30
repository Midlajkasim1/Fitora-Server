import { ReportType } from "@/domain/constants/report.constants";

export interface CreateReportRequestDTO {
    reporterId: string;
    reportedId: string;
    type: ReportType;
    description: string;
    sessionId?: string;
}
