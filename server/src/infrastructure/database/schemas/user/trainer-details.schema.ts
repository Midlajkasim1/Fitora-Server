import { Schema } from "mongoose";

export const TrainerDetailsSchema = new Schema(
    {
        user_id: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
            index: true
        },
        bio: {
            type: String,
            required: true
        },
        experience_year: {
            type: Number,
            required: true
        },
        certifications: {
            type: [String],
            default: []
        },
        specializations: {
            type: Schema.Types.ObjectId,
            ref: "Specialization"
        }
        ,
        rating: {
            type: Number,
            default: 0
        },
        total_reviews: {
            type: String,
            default: "0"
        },
        verified: {
            type: Boolean,
            default: false
        },
        is_online: {
            type: Boolean,
            default: false
        },
        approval_status: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending"
        },
        rejection_reason: {
            type: String,
            default: null
        },
        last_seen: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: {
            createdAt: "created_at",
            updatedAt: "update_at"
        },
        versionKey: false
    }
);