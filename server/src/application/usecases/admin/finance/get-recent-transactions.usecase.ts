import { ITransactionRepository } from "@/domain/interfaces/repositories/transaction.repository";

export interface RecentTransactionsRequest {
    page: number;
    limit: number;
    search?: string;
}

export class GetRecentTransactionsUseCase {
    constructor(private readonly _transactionRepository: ITransactionRepository) {}

    async execute(request: RecentTransactionsRequest) {
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
