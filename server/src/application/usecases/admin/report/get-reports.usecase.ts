import { IReportRepository } from "@/domain/interfaces/repositories/report.repository";
import { GetReportsRequestDTO, GetReportsResponseDTO } from "@/application/dto/admin/request/get-reports.dto";

export class GetReportsUseCase {
    constructor(private readonly _reportRepository: IReportRepository) {}

    async execute(request: GetReportsRequestDTO): Promise<GetReportsResponseDTO> {
        const { data, total } = await this._reportRepository.findAllFiltered(request);
        
        return {
            data: data.map(report => ({
                id: report.id!,
                reporterId: report.reporterId,
                reporter: report.reporter,
                reportedId: report.reportedId,
                reportedName: report.reportedName,
                type: report.type,
                status: report.status,
                description: report.description,
                createdAt: report.createdAt!,
                updatedAt: report.updatedAt!
            })),
            total
        };
    }
}
