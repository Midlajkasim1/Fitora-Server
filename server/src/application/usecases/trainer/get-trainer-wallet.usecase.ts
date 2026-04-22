import { ITrainerRepository } from "@/domain/interfaces/repositories/itrainer.repository";
import { ITransactionRepository } from "@/domain/interfaces/repositories/transaction.repository";
import { TransactionType } from "@/domain/entities/transaction/transaction.entity";
import { IBaseUseCase } from "@/application/interfaces/base-usecase.interface";

export interface TrainerWalletResponse {
    walletBalance: number;
    recentTransactions: {
        id: string;
        amount: number;
        type: TransactionType;
        status: string;
        description: string;
        createdAt: Date;
    }[];
}

export class GetTrainerWalletUseCase implements IBaseUseCase<string, TrainerWalletResponse> {
    constructor(
        private readonly _trainerRepository: ITrainerRepository,
        private readonly _transactionRepository: ITransactionRepository
    ) {}

    async execute(trainerId: string): Promise<TrainerWalletResponse> {
        const trainer = await this._trainerRepository.findByTrainerId(trainerId);
        if (!trainer) {
            throw new Error("Trainer not found");
        }

        // Fetch recent transactions for this trainer
        const transactions = await this._transactionRepository.findByUserId(trainerId);

        return {
            walletBalance: trainer.walletBalance,
            recentTransactions: transactions.slice(0, 10).map(tx => ({
                id: tx.id!,
                amount: tx.amount,
                type: tx.type,
                status: tx.status,
                description: tx.description,
                createdAt: tx.createdAt!
            }))
        };
    }
}
