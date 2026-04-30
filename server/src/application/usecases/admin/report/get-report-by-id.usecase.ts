import { IReportRepository } from "@/domain/interfaces/repositories/report.repository";
import { ReportResponseDTO } from "@/application/dto/report/response/report-response.dto";
import { IBaseUseCase } from "@/application/interfaces/base-usecase.interface";
import { REPORT_MESSAGES } from "@/domain/constants/messages.constants";

export class GetReportByIdUseCase implements IBaseUseCase<string, ReportResponseDTO> {
    constructor(private readonly _reportRepository: IReportRepository) {}

    async execute(id: string): Promise<ReportResponseDTO> {
        const report = await this._reportRepository.findByIdWithDetails(id);

        if (!report) {
            throw new Error(REPORT_MESSAGES.REPORT_NOT_FOUND);
        }

        return report;
    }
}
