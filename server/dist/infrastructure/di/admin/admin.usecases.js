"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminUseCases = void 0;
const admin_login_usecase_1 = require("@/application/usecases/admin/admin-login.usecase");
const jwt_token_service_1 = require("@/infrastructure/providers/auth/jwt-token.service");
const bcrypt_password_service_1 = require("@/infrastructure/providers/crypto/bcrypt-password.service");
const admin_repositories_1 = require("./admin.repositories");
const tokenService = new jwt_token_service_1.JwtTokenService();
const passwordHasher = new bcrypt_password_service_1.BcryptPasswordHasher();
exports.adminUseCases = {
    adminLoginUseCase: new admin_login_usecase_1.AdminLoginUseCase(admin_repositories_1.adminRepositories.adminRepository, passwordHasher, tokenService),
};
