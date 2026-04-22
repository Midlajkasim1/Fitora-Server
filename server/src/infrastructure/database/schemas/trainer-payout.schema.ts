import { Schema } from "mongoose";

export const TrainerPayoutSchema = new Schema({
    trainerId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    slotId: {
        type: Schema.Types.ObjectId,
        ref: "Slot",
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    platformFee: {
        type: Number,
        required: true
    },
    totalAmount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ["PENDING", "PAID"],
        default: "PENDING"
    }
}, { timestamps: true });

TrainerPayoutSchema.index({ trainerId: 1 });
TrainerPayoutSchema.index({ slotId: 1 }, { unique: true });
