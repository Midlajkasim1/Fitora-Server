"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserProfileSchema = void 0;
const mongoose_1 = require("mongoose");
const ObjectId = mongoose_1.Types.ObjectId;
exports.UserProfileSchema = new mongoose_1.Schema({
    user_id: {
        type: ObjectId,
        ref: "User",
        required: true,
        unique: true,
        index: true,
    },
    firstName: {
        type: String,
        required: true,
        trim: true,
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
    },
    phone: {
        type: String,
        required: true,
        index: true,
    },
    profileImage: {
        type: String,
        default: null,
    },
}, { timestamps: true, versionKey: false });
