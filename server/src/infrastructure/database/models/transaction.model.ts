import { model } from "mongoose";
import { TransactionSchema } from "../schemas/transaction.schema";

export const TransactionModel = model("Transaction", TransactionSchema);
