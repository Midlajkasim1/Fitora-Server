import { TransactionEntity, TransactionStatus, TransactionType } from "@/domain/entities/transaction/transaction.entity";
import { IMapper } from "@/domain/interfaces/services/mapper.interface";
import { Types } from "mongoose";

export interface ITransactionDocument {
    _id: Types.ObjectId;
    userId?: Types.ObjectId;
    entityName: string;
    amount: number;
    type: TransactionType;
    status: TransactionStatus;
    description: string;
    referenceId?: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

export class TransactionMapper implements IMapper<TransactionEntity, ITransactionDocument> {
    toEntity(doc: ITransactionDocument): TransactionEntity {
        return new TransactionEntity({
            id: doc._id.toString(),
            userId: doc.userId?.toString(),
            entityName: doc.entityName,
            amount: doc.amount,
            type: doc.type,
            status: doc.status,
            description: doc.description,
            referenceId: doc.referenceId?.toString(),
            createdAt: doc.createdAt
        });
    }

    toMongo(entity: TransactionEntity): Partial<ITransactionDocument> {
        return {
            userId: entity.userId ? new Types.ObjectId(entity.userId) : undefined,
            entityName: entity.entityName,
            amount: entity.amount,
            type: entity.type,
            status: entity.status,
            description: entity.description,
            referenceId: entity.referenceId ? new Types.ObjectId(entity.referenceId) : undefined
        };
    }
}
