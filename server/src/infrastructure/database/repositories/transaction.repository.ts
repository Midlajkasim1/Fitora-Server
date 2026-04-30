import { ITransactionRepository, IFinancialOverview } from "@/domain/interfaces/repositories/transaction.repository";
import { TransactionEntity, TransactionType } from "@/domain/entities/transaction/transaction.entity";
import { TransactionMapper, ITransactionDocument } from "../mappers/transaction.mapper";
import { TransactionModel } from "../models/transaction.model";
import { BaseRepository } from "./base.repository";
import { Model } from "mongoose";

export class TransactionRepository extends BaseRepository<TransactionEntity, ITransactionDocument> implements ITransactionRepository {
    constructor(private readonly _transactionMapper: TransactionMapper) {
        super(TransactionModel as unknown as Model<ITransactionDocument>, _transactionMapper);
    }

    async findByUserId(userId: string): Promise<TransactionEntity[]> {
        const docs = await TransactionModel.find({ userId }).sort({ createdAt: -1 }).lean<ITransactionDocument[]>();
        return docs.map(doc => this._transactionMapper.toEntity(doc));
    }

    async getFinancialOverview(startDate: Date, endDate: Date): Promise<IFinancialOverview[]> {
        return await TransactionModel.aggregate<IFinancialOverview>([
            {
                $facet: {
                    totals: [
                        { $match: { createdAt: { $gte: startDate, $lte: endDate } } },
                        {
                            $group: {
                                _id: "$type",
                                total: { $sum: "$amount" }
                            }
                        }
                    ],
                    subscriptionSplit: [
                        { 
                            $match: { 
                                type: TransactionType.SUBSCRIPTION_PURCHASE,
                                createdAt: { $gte: startDate, $lte: endDate }
                            } 
                        },
                        {
                            $group: {
                                _id: {
                                    isPremium: { $regexMatch: { input: "$description", regex: "Premium", options: "i" } }
                                },
                                total: { $sum: "$amount" }
                            }
                        }
                    ],
                    chartData: [
                        { $match: { createdAt: { $gte: startDate, $lte: endDate } } },
                        {
                            $group: {
                                _id: {
                                    date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                                    type: "$type"
                                },
                                amount: { $sum: "$amount" }
                            }
                        }
                    ]
                }
            }
        ]);
    }

    async findRecentTransactions(params: { page: number; limit: number; search?: string }): Promise<{ data: TransactionEntity[]; total: number }> {
        const { page, limit, search } = params;
        const skip = (page - 1) * limit;

        const filter: Record<string, unknown> = {
            type: { $ne: TransactionType.WITHDRAWAL }
        };

        if (search) {
            filter.$and = [
                { type: { $ne: TransactionType.WITHDRAWAL } },
                {
                    $or: [
                        { entityName: { $regex: search, $options: "i" } },
                        { description: { $regex: search, $options: "i" } },
                        { type: { $regex: search, $options: "i" } }
                    ]
                }
            ];
            delete filter.type; // Removed because it's handled in $and
        }

        const [docs, total] = await Promise.all([
            TransactionModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean<ITransactionDocument[]>(),
            TransactionModel.countDocuments(filter)
        ]);

        return {
            data: docs.map(doc => this._transactionMapper.toEntity(doc)),
            total
        };
    }

    async findPaginatedByUserId(userId: string, params: { page: number; limit: number }): Promise<{ data: TransactionEntity[]; total: number }> {
        const { page, limit } = params;
        const skip = (page - 1) * limit;

        const filter = { userId };
        
        const [docs, total] = await Promise.all([
            TransactionModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean<ITransactionDocument[]>(),
            TransactionModel.countDocuments(filter)
        ]);

        return {
            data: docs.map(doc => this._transactionMapper.toEntity(doc)),
            total
        };
    }
}
