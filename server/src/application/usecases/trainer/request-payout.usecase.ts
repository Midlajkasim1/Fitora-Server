import { ITrainerRepository } from "@/domain/interfaces/repositories/itrainer.repository";
import { ITransactionRepository } from "@/domain/interfaces/repositories/transaction.repository";
import { TransactionEntity, TransactionType, TransactionStatus } from "@/domain/entities/transaction/transaction.entity";
import { IBaseUseCase } from "@/application/interfaces/base-usecase.interface";
import { AUTH_MESSAGES, FINANCE_MESSAGES } from "@/domain/constants/messages.constants";

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
            throw new Error(AUTH_MESSAGES.TRAINER_ID_NOT_FOUND);
        }

        if (trainer.walletBalance < amount) {
            throw new Error(FINANCE_MESSAGES.INSUFFICIENT_BALANCE);
        }

        if (amount < 100) { 
            throw new Error(FINANCE_MESSAGES.MIN_WITHDRAWAL_AMOUNT(100));
        }

        await this._trainerRepository.updateWalletBalance(trainerId, -amount);

        const transaction = new TransactionEntity({
            userId: trainerId,
            entityName: "Wallet Withdrawal",
            amount: -amount,
            type: TransactionType.WITHDRAWAL,
            status: TransactionStatus.SUCCESS,
            description: `Withdrawal request for ₹${amount}`,
        });

        await this._transactionRepository.create(transaction);
    }
}
