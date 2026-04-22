import { Schema, model, Types } from "mongoose";
import { TransactionStatus, TransactionType } from "@/domain/entities/transaction/transaction.entity";

const TransactionSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            index: true
        },
        entityName: {
            type: String,
            required: true
        },
        amount: {
            type: Number,
            required: true
        },
        type: {
            type: String,
            enum: Object.values(TransactionType),
            required: true
        },
        status: {
            type: String,
            enum: Object.values(TransactionStatus),
            required: true
        },
        description: {
            type: String,
            required: true
        },
        referenceId: {
            type: Schema.Types.ObjectId,
            default: null
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

export const TransactionModel = model("Transaction", TransactionSchema);
