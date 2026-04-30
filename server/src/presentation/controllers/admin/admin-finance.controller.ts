import { Request, Response } from "express";
import { GetFinanceOverviewUseCase } from "@/application/usecases/admin/finance/get-finance-overview.usecase";
import { GetRecentTransactionsUseCase } from "@/application/usecases/admin/finance/get-recent-transactions.usecase";
import { GenerateFinanceReportUseCase } from "@/application/usecases/admin/finance/generate-finance-report.usecase";

import { HandlePayoutUseCase } from "@/application/usecases/admin/finance/handle-payout.usecase";

import { GetAdminDashboardStatsUseCase } from "@/application/usecases/admin/get-admin-dashboard-stats.usecase";
import { HttpStatus } from "@/domain/constants/http-status.constants";
import { ApiResponse } from "@/shared/utils/response.handler";
import { FINANCE_MESSAGES } from "@/domain/constants/messages.constants";

export class AdminFinanceController {
    constructor(
        private readonly _getFinanceOverviewUseCase: GetFinanceOverviewUseCase,
        private readonly _getRecentTransactionsUseCase: GetRecentTransactionsUseCase,
        private readonly _generateFinanceReportUseCase: GenerateFinanceReportUseCase,
        private readonly _handlePayoutUseCase: HandlePayoutUseCase,
        private readonly _getDashboardStatsUseCase: GetAdminDashboardStatsUseCase
    ) {}

    async getDashboardStats(req: Request, res: Response) {
        try {
            const year = req.query.year ? Number(req.query.year) : new Date().getFullYear();
            const data = await this._getDashboardStatsUseCase.execute(year);
            res.status(HttpStatus.OK).json(ApiResponse.success(data));
        } catch (error: unknown) {
            const err = error as Error;
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(ApiResponse.error(err.message));
        }
    }

    async getOverview(req: Request, res: Response) {
        try {
            const data = await this._getFinanceOverviewUseCase.execute();
            res.status(HttpStatus.OK).json(ApiResponse.success(data));
        } catch (error: unknown) {
            const err = error as Error;
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(ApiResponse.error(err.message));
        }
    }

    async getTransactions(req: Request, res: Response) {
        try {
            const { page = 1, limit = 10, search = "" } = req.query;
            const data = await this._getRecentTransactionsUseCase.execute({
                page: Number(page),
                limit: Number(limit),
                search: String(search)
            });
            res.status(HttpStatus.OK).json(ApiResponse.success(data));
        } catch (error: unknown) {
            const err = error as Error;
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(ApiResponse.error(err.message));
        }
    }

    async generateReport(req: Request, res: Response) {
        try {
            const { startDate, endDate } = req.query;
            const data = await this._generateFinanceReportUseCase.execute({
                startDate: new Date(String(startDate)),
                endDate: new Date(String(endDate))
            });
            
            res.setHeader("Content-Type", "text/csv");
            res.setHeader("Content-Disposition", `attachment; filename=${data.fileName}`);
            res.status(HttpStatus.OK).send(data.content);
        } catch (error: unknown) {
            const err = error as Error;
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(ApiResponse.error(err.message));
        }
    }

    async handlePayout(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { status } = req.body;
            await this._handlePayoutUseCase.execute({ transactionId: id, status });
            res.status(HttpStatus.OK).json(ApiResponse.success(null, FINANCE_MESSAGES.PAYOUT_STATUS_UPDATED(status)));
        } catch (error: unknown) {
            const err = error as Error;
            res.status(HttpStatus.BAD_REQUEST).json(ApiResponse.error(err.message));
        }
    }
}
