import { TransactionEntity } from "@/domain/entities/transaction/transaction.entity";
import { IBaseRepository } from "./base.repository";

export interface IFinancialOverview {
    totals: Array<{ _id: string, total: number }>;
    subscriptionSplit: Array<{ _id: { isPremium: boolean }, total: number }>;
    chartData: Array<{ _id: { date: string, type: string }, amount: number }>;
}

export interface ITransactionRepository extends IBaseRepository<TransactionEntity> {
    create(transaction: TransactionEntity): Promise<TransactionEntity>;
    findByUserId(userId: string): Promise<TransactionEntity[]>;
    getFinancialOverview(startDate: Date, endDate: Date): Promise<IFinancialOverview[]>;
    findRecentTransactions(params: { page: number; limit: number; search?: string }): Promise<{ data: TransactionEntity[]; total: number }>;
}
