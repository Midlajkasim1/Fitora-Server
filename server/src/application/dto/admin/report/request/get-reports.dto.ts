import { ReportStatus, ReportType } from "@/domain/constants/report.constants";
import { ReportResponseDTO } from "@/application/dto/report/response/report-response.dto";

export interface GetReportsRequestDTO {
    page: number;
    limit: number;
    status?: ReportStatus;
    type?: ReportType;
    search?: string;
}

export interface GetReportsResponseDTO {
    data: ReportResponseDTO[];
    total: number;
}
