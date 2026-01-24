"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminRepositories = void 0;
const admin_repository_1 = require("@/infrastructure/database/repositories/admin.repository");
exports.adminRepositories = {
    adminRepository: new admin_repository_1.AdminRepository(),
};
