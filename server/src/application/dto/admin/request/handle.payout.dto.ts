import { TransactionStatus } from "@/domain/entities/transaction/transaction.entity";

export interface HandlePayoutDTO {
    transactionId: string;
    status: TransactionStatus.SUCCESS | TransactionStatus.FAILED;
}