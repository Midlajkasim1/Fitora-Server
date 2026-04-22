import { ITransactionRepository } from "@/domain/interfaces/repositories/transaction.repository";

export interface GenerateReportRequest {
    startDate: Date;
    endDate: Date;
}

export class GenerateFinanceReportUseCase {
    constructor(private readonly _transactionRepository: ITransactionRepository) {}

    async execute(request: GenerateReportRequest) {
        // Fetch all transactions in range
        // In a real scenario, we'd use a service to generate a PDF/CSV
        // For now, we return data structured for the frontend to export
        
        const filter = {
            createdAt: { $gte: request.startDate, $lte: request.endDate }
        };
        
        const transactions = await this._transactionRepository.find(filter, { skip: 0, limit: 1000 });
        
        const csvHeader = "ID,Entity,Type,Amount,Status,Date\n";
        const csvRows = transactions.map(tx => 
            `${tx.id},${tx.entityName},${tx.type},${tx.amount},${tx.status},${tx.createdAt?.toISOString()}`
        ).join("\n");

        return {
            fileName: `finance-report-${new Date().toISOString().split('T')[0]}.csv`,
            content: csvHeader + csvRows
        };
    }
}
