"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminControllers = void 0;
const admin_auth_controller_1 = require("@/presentation/controllers/admin-auth.controller");
const admin_usecases_1 = require("./admin.usecases");
exports.adminControllers = {
    adminAuthController: new admin_auth_controller_1.AdminAuthController(admin_usecases_1.adminUseCases.adminLoginUseCase),
};
