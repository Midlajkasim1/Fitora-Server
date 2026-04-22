import { ITrainerRepository } from "@/domain/interfaces/repositories/itrainer.repository";
import { ITransactionRepository } from "@/domain/interfaces/repositories/transaction.repository";
import { TransactionEntity, TransactionType, TransactionStatus } from "@/domain/entities/transaction/transaction.entity";
import { IBaseUseCase } from "@/application/interfaces/base-usecase.interface";

export interface RequestPayoutDTO {
    trainerId: string;
    amount: number;
}

export class RequestPayoutUseCase implements IBaseUseCase<RequestPayoutDTO, void> {
    constructor(
        private readonly _trainerRepository: ITrainerRepository,
        private readonly _transactionRepository: ITransactionRepository
    ) {}

    async execute(dto: RequestPayoutDTO): Promise<void> {
        const { trainerId, amount } = dto;
        const trainer = await this._trainerRepository.findByTrainerId(trainerId);
        if (!trainer) {
            throw new Error("Trainer not found");
        }

        if (trainer.walletBalance < amount) {
            throw new Error("Insufficient balance");
        }

        if (amount < 100) { // Minimum withdrawal amount
            throw new Error("Minimum withdrawal amount is 100");
        }

        // 1. Deduct balance immediately (lock it)
        await this._trainerRepository.updateWalletBalance(trainerId, -amount);

        // 2. Create a pending withdrawal transaction
        const transaction = new TransactionEntity({
            userId: trainerId,
            entityName: "Wallet Withdrawal",
            amount: amount,
            type: TransactionType.WITHDRAWAL,
            status: TransactionStatus.PENDING,
            description: `Withdrawal request for ₹${amount}`,
        });

        await this._transactionRepository.save(transaction);
    }
}
