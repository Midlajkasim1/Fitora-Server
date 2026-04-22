import { GetReportsUseCase } from "@/application/usecases/admin/report/get-reports.usecase";
import { GetReportSummaryUseCase } from "@/application/usecases/admin/report/get-report-summary.usecase";
import { UpdateReportStatusUseCase } from "@/application/usecases/admin/report/update-report-status.usecase";
import { GetReportByIdUseCase } from "@/application/usecases/admin/report/get-report-by-id.usecase";

import { HttpStatus } from "@/domain/constants/http-status.constants";
import { ReportStatus, ReportType } from "@/domain/constants/report.constants";
import { ApiResponse } from "@/shared/utils/response.handler";
import { Request, Response } from "express";

export class AdminReportController {
    constructor(
        private readonly _getReportsUseCase: GetReportsUseCase,
        private readonly _getReportSummaryUseCase: GetReportSummaryUseCase,
        private readonly _updateReportStatusUseCase: UpdateReportStatusUseCase,
        private readonly _getReportByIdUseCase: GetReportByIdUseCase
    ) {}

    async getReportById(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        try {
            const result = await this._getReportByIdUseCase.execute(id);
            return res.status(HttpStatus.OK).json(ApiResponse.success(result));
        } catch (error: unknown) {
            return res.status(HttpStatus.NOT_FOUND).json(ApiResponse.error(error.message));
        }
    }


    async getReports(req: Request, res: Response): Promise<Response> {
        const query = {
            page: Number(req.query.page) || 1,
            limit: Number(req.query.limit) || 10,
            status: req.query.status as ReportStatus,
            type: req.query.type as ReportType,
            search: req.query.search as string
        };

        const result = await this._getReportsUseCase.execute(query);
        return res.status(HttpStatus.OK).json(ApiResponse.success(result));
    }

    async getSummary(req: Request, res: Response): Promise<Response> {
        const result = await this._getReportSummaryUseCase.execute();
        return res.status(HttpStatus.OK).json(ApiResponse.success(result));
    }

    async updateStatus(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const { status, resolutionNotes } = req.body;

        try {
            const result = await this._updateReportStatusUseCase.execute({
                reportId: id,
                status,
                resolutionNotes
            });
            return res.status(HttpStatus.OK).json(ApiResponse.success(result, "Report status updated successfully"));
        } catch (error: unknown) {
            return res.status(HttpStatus.BAD_REQUEST).json(ApiResponse.error(error.message));
        }
    }
}
