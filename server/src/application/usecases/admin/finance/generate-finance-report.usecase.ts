import { ITransactionRepository } from "@/domain/interfaces/repositories/transaction.repository";
import { IBaseUseCase } from "@/application/interfaces/base-usecase.interface";
import { GenerateReportRequestDTO } from "@/application/dto/admin/request/admin-generate-report.dto";
import { GenerateFinanceReportResponseDTO } from "@/application/dto/admin/response/admin-generate-report.dto";





export class GenerateFinanceReportUseCase implements IBaseUseCase<GenerateReportRequestDTO, GenerateFinanceReportResponseDTO> {
    constructor(private readonly _transactionRepository: ITransactionRepository) { }

    async execute(request: GenerateReportRequestDTO): Promise<GenerateFinanceReportResponseDTO> {


        const filter = {
            createdAt: { $gte: request.startDate, $lte: request.endDate }
        };

        const transactions = await this._transactionRepository.find(filter, { skip: 0, limit: 1000 });

        const csvHeader = "ID,Entity,Type,Amount,Status,Date\n";
        const csvRows = transactions.map(tx =>
            `${tx.id},${tx.entityName},${tx.type},${tx.amount},${tx.status},${tx.createdAt?.toISOString()}`
        ).join("\n");

        return {
            fileName: `finance-report-${new Date().toISOString().split("T")[0]}.csv`,
            content: csvHeader + csvRows
        };
    }
}
