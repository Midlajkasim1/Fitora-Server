import { Request, Response } from "express";
import { GetFinanceOverviewUseCase } from "@/application/usecases/admin/finance/get-finance-overview.usecase";
import { GetRecentTransactionsUseCase } from "@/application/usecases/admin/finance/get-recent-transactions.usecase";
import { GenerateFinanceReportUseCase } from "@/application/usecases/admin/finance/generate-finance-report.usecase";

export class AdminFinanceController {
    constructor(
        private readonly _getFinanceOverviewUseCase: GetFinanceOverviewUseCase,
        private readonly _getRecentTransactionsUseCase: GetRecentTransactionsUseCase,
        private readonly _generateFinanceReportUseCase: GenerateFinanceReportUseCase
    ) {}

    async getOverview(req: Request, res: Response) {
        try {
            const data = await this._getFinanceOverviewUseCase.execute();
            res.status(200).json(data);
        } catch (error: unknown) {
            res.status(500).json({ message: error.message });
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
            res.status(200).json(data);
        } catch (error: unknown) {
            res.status(500).json({ message: error.message });
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
            res.status(200).send(data.content);
        } catch (error: unknown) {
            res.status(500).json({ message: error.message });
        }
    }
}
