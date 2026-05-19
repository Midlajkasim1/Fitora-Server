import { ReportStatus, ReportType } from "@/domain/constants/report.constants";

export interface CreateReportResponseDTO {
    id: string;
    reporterId: string;
    reportedId: string;
    type: ReportType;
    status: ReportStatus;
    description: string;
    createdAt: Date;
    updatedAt: Date;
}
