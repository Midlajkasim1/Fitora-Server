"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminModel = void 0;
const mongoose_1 = require("mongoose");
const AdminSchema = new mongoose_1.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    status: { type: String, enum: ["active", "blocked"], default: "active" },
}, { timestamps: true });
exports.AdminModel = (0, mongoose_1.model)("Admin", AdminSchema);
