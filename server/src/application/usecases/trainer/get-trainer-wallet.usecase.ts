import { ITrainerRepository } from "@/domain/interfaces/repositories/itrainer.repository";
import { ITransactionRepository } from "@/domain/interfaces/repositories/transaction.repository";
import { TransactionType } from "@/domain/entities/transaction/transaction.entity";
import { IBaseUseCase } from "@/application/interfaces/base-usecase.interface";
import { AUTH_MESSAGES } from "@/domain/constants/messages.constants";

export interface TrainerWalletResponse {
    walletBalance: number;
    transactions: {
        id: string;
        amount: number;
        type: TransactionType;
        status: string;
        description: string;
        createdAt: Date;
    }[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export interface GetTrainerWalletRequest {
    trainerId: string;
    page: number;
    limit: number;
}

export class GetTrainerWalletUseCase implements IBaseUseCase<GetTrainerWalletRequest, TrainerWalletResponse> {
    constructor(
        private readonly _trainerRepository: ITrainerRepository,
        private readonly _transactionRepository: ITransactionRepository
    ) {}

    async execute(request: GetTrainerWalletRequest): Promise<TrainerWalletResponse> {
        const { trainerId, page, limit } = request;
        
        const trainer = await this._trainerRepository.findByTrainerId(trainerId);
        if (!trainer) {
            throw new Error(AUTH_MESSAGES.TRAINER_ID_NOT_FOUND);
        }

        const { data: transactions, total } = await this._transactionRepository.findPaginatedByUserId(trainerId, { page, limit });

        return {
            walletBalance: trainer.walletBalance,
            transactions: transactions.map(tx => ({
                id: tx.id!,
                amount: tx.amount,
                type: tx.type,
                status: tx.status,
                description: tx.description,
                createdAt: tx.createdAt!
            })),
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        };
    }
}
