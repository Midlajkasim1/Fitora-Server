import { ReportSummaryDTO } from "@/application/dto/admin/report/response/report-summary.dto";
import { IReportRepository } from "@/domain/interfaces/repositories/report.repository";

export class GetReportSummaryUseCase {
    constructor(private readonly _reportRepository: IReportRepository) {}

    async execute(): Promise<ReportSummaryDTO> {
        return await this._reportRepository.getSummary();
    }
}
