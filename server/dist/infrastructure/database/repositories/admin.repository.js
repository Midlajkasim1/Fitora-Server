"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminRepository = void 0;
const admin_models_1 = require("../models/admin.models");
const admin_mapper_1 = require("../mappers/admin.mapper");
class AdminRepository {
    async findByEmail(email) {
        const doc = await admin_models_1.AdminModel.findOne({ email });
        if (!doc)
            return null;
        return {
            admin: admin_mapper_1.AdminMapper.toEntity(doc),
            passwordHash: doc.password,
        };
    }
}
exports.AdminRepository = AdminRepository;
