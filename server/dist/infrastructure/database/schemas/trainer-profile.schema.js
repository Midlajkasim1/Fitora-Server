"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrainerProfileSchema = void 0;
const mongoose_1 = require("mongoose");
const ObjectId = mongoose_1.Types.ObjectId;
exports.TrainerProfileSchema = new mongoose_1.Schema({
    user_id: {
        type: ObjectId,
        ref: "User",
        required: true,
        unique: true,
        index: true,
    },
    bio: {
        type: String,
        trim: true,
    },
    certifications: [
        {
            type: String,
        },
    ],
    experienceYears: {
        type: Number,
        min: 0,
    },
    specializations: [
        {
            type: ObjectId,
            ref: "Specialization",
        },
    ],
    approvalStatus: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending",
    },
    verified: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
    versionKey: false,
});
