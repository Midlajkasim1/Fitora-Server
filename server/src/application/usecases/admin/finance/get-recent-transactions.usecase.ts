import { ITransactionRepository } from "@/domain/interfaces/repositories/transaction.repository";
import { IBaseUseCase } from "@/application/interfaces/base-usecase.interface";
import { RecentTransactionsRequestDTO } from "@/application/dto/admin/request/recent-transaction.dto";
import { GetRecentTransactionsResponseDTO } from "@/application/dto/admin/response/recent-trainsactions.dto";




export class GetRecentTransactionsUseCase implements IBaseUseCase<RecentTransactionsRequestDTO, GetRecentTransactionsResponseDTO> {
    constructor(private readonly _transactionRepository: ITransactionRepository) {}

    async execute(request: RecentTransactionsRequestDTO): Promise<GetRecentTransactionsResponseDTO> {
        const { data, total } = await this._transactionRepository.findRecentTransactions(request);
        
        return {
            transactions: data.map(tx => ({
                id: tx.id,
                entityName: tx.entityName,
                type: tx.type,
                amount: tx.amount,
                status: tx.status,
                description: tx.description,
                createdAt: tx.createdAt
            })),
            total,
            page: request.page,
            limit: request.limit
        };
    }
}
