"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSchema = void 0;
const mongoose_1 = require("mongoose");
exports.UserSchema = new mongoose_1.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true,
    },
    password: {
        type: String,
        required: function () {
            return this.authProvider === "local";
        },
        select: false,
    },
    authProvider: {
        type: String,
        enum: ["local", "google"],
        default: "local",
    },
    googleId: {
        type: String,
        default: null,
        index: true,
    },
    role: {
        type: String,
        enum: ["user", "trainer"],
        required: true,
        default: "user",
    },
    status: {
        type: String,
        enum: ["active", "blocked"],
        default: "active",
    },
    isEmailVerified: {
        type: Boolean,
        default: false,
    },
    lastLoginAt: {
        type: Date,
        default: null,
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
        required: function () {
            return this.authProvider === "local";
        },
        index: true,
        default: "",
    },
}, {
    timestamps: true,
    versionKey: false,
});
