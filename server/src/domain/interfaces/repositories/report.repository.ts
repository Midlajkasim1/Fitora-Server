import { ReportStatus, ReportType } from "@/domain/constants/report.constants";
import { ReportEntity } from "@/domain/entities/report/report.entity";
import { IBaseRepository } from "./base.repository";

export interface IReportListItem {
    id: string;
    reporterId: string;
    reporter: {
        name: string;
        role: string;
        profileImage: string | null;
    };
    reportedId: string;
    reportedName: string;
    type: ReportType;
    status: ReportStatus;
    description: string;
    resolutionNotes?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface IReportSummary {
    total: number;
    pending: number;
    resolved: number;
    underReview: number;
    dismissed: number;
}

export interface IReportRepository extends IBaseRepository<ReportEntity> {
    findAllFiltered(params: {
        page: number;
        limit: number;
        status?: ReportStatus;
        type?: ReportType;
        search?: string;
    }): Promise<{ data: IReportListItem[]; total: number }>;

    updateStatus(id: string, status: ReportStatus, resolutionNotes?: string): Promise<ReportEntity | null>;
    getSummary(): Promise<IReportSummary>;
    findByIdWithDetails(id: string): Promise<IReportListItem | null>;
}
