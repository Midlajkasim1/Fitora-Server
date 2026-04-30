import { ReportStatus } from "@/domain/constants/report.constants";

export interface UpdateReportStatusRequestDTO {
    reportId: string;
    status: ReportStatus;
    resolutionNotes?: string;
}
