"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterUseCase = void 0;
// import { PasswordHasher } from "@/shared/utils/password-hash";
// import { BcryptPasswordHasher } from "@/infrastructure/providers/crypto/bcrypt-password";
const crypto_1 = require("crypto");
class RegisterUseCase {
    otpStore;
    emailService;
    passwordHasher;
    constructor(otpStore, emailService, passwordHasher) {
        this.otpStore = otpStore;
        this.emailService = emailService;
        this.passwordHasher = passwordHasher;
    }
    async execute(dto) {
        const { email, password } = dto;
        const hashedPassword = await this.passwordHasher.hash(password);
        const otp = (0, crypto_1.randomInt)(100000, 999999).toString();
        const ttl = 300;
        const redisKey = `otp:register:${email}`;
        await this.otpStore.save(redisKey, {
            ...dto,
            password: hashedPassword,
            otp,
        }, ttl);
        console.log('otp is:', otp);
        await this.emailService.sendOtp(email, otp);
        return { message: "OTP sent to your email" };
    }
}
exports.RegisterUseCase = RegisterUseCase;
