"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useCases = void 0;
const google_auth_usecase_1 = require("@/application/usecases/auth/google-auth.usecase");
const login_usecase_1 = require("@/application/usecases/auth/login.usecase");
const register_usecase_1 = require("@/application/usecases/auth/register.usecase");
const verify_otp_usecase_1 = require("@/application/usecases/auth/verify-otp.usecase");
const google_token_provider_1 = require("../../providers/auth/google-token.provider");
const jwt_token_service_1 = require("../../providers/auth/jwt-token.service");
const bcrypt_password_service_1 = require("../../providers/crypto/bcrypt-password.service");
const nodemailer_service_1 = require("../../providers/email/nodemailer.service");
const redis_otp_store_1 = require("../../providers/redis/redis-otp.store");
const user_repositories_1 = require("./user.repositories");
const ResendOtp_usecase_1 = require("@/application/usecases/auth/ResendOtp.usecase");
const otpStore = new redis_otp_store_1.RedisOtpStore();
const emailService = new nodemailer_service_1.NodemailerEmailService();
const passwordHasher = new bcrypt_password_service_1.BcryptPasswordHasher();
const tokenService = new jwt_token_service_1.JwtTokenService();
const googleTokenProvider = new google_token_provider_1.GoogleTokenProvider();
exports.useCases = {
    registerUseCase: new register_usecase_1.RegisterUseCase(otpStore, emailService, passwordHasher),
    verifyOtpUseCase: new verify_otp_usecase_1.VerifyOtpUseCase(otpStore, user_repositories_1.userRepositories.userRepository),
    resendOtpUseCase: new ResendOtp_usecase_1.ResendOtpUseCase(otpStore, emailService),
    loginUseCase: new login_usecase_1.LoginUseCase(user_repositories_1.userRepositories.userRepository, passwordHasher, tokenService),
    googleAuthUseCase: new google_auth_usecase_1.GoogleAuthUseCase(user_repositories_1.userRepositories.userRepository, tokenService, googleTokenProvider)
};
