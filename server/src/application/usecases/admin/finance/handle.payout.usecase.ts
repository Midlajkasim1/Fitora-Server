import { HandlePayoutDTO } from "@/application/dto/admin/request/handle.payout.dto";
import { IBaseUseCase } from "@/application/interfaces/base.usecase.interface";
import { FINANCE_MESSAGES } from "@/domain/constants/messages.constants";
import { TransactionStatus } from "@/domain/entities/transaction/transaction.entity";
import { ITrainerRepository } from "@/domain/interfaces/repositories/itrainer.repository";
import { ITransactionRepository } from "@/domain/interfaces/repositories/transaction.repository";



export class HandlePayoutUseCase implements IBaseUseCase<HandlePayoutDTO, void> {
    constructor(
        private readonly _transactionRepository: ITransactionRepository,
        private readonly _trainerRepository: ITrainerRepository
    ) {}

    async execute(dto: HandlePayoutDTO): Promise<void> {
        const { transactionId, status } = dto;

        const transaction = await this._transactionRepository.findById(transactionId);
        if (!transaction) {
            throw new Error(FINANCE_MESSAGES.TRANSACTION_NOT_FOUND);
        }

        if (transaction.status !== TransactionStatus.PENDING) {
            throw new Error(FINANCE_MESSAGES.TRANSACTION_ALREADY_PROCESSED);
        }

        await this._transactionRepository.update(transactionId, { status });

        if (status === TransactionStatus.FAILED) {
            if (!transaction.userId) {
                throw new Error(FINANCE_MESSAGES.USER_ID_MISSING);
            }
            await this._trainerRepository.updateWalletBalance(transaction.userId, Math.abs(transaction.amount));
        }
    }
}
