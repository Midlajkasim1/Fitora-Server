"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerifyOtpUseCase = void 0;
const user_entity_1 = require("@/domain/entities/user.entity");
class VerifyOtpUseCase {
    otpStore;
    userRepository;
    constructor(otpStore, userRepository) {
        this.otpStore = otpStore;
        this.userRepository = userRepository;
    }
    async execute(email, otp) {
        const redisKey = `otp:register:${email}`;
        const stored = await this.otpStore.get(redisKey);
        if (!stored) {
            throw new Error("OTP expired or invalid");
        }
        if (!stored.email || !stored.role) {
            throw new Error("Invalid registration session. Please sign up again.");
        }
        if (stored.otp !== otp) {
            throw new Error("Invalid OTP");
        }
        const user = user_entity_1.UserEntity.create({
            email: stored.email,
            firstName: stored.firstName,
            lastName: stored.lastName,
            phone: stored.phone,
            role: stored.role,
            isEmailVerified: true,
        });
        await this.userRepository.create(user, stored.password);
        await this.otpStore.delete(redisKey);
        return { message: "Account verified successfully" };
    }
}
exports.VerifyOtpUseCase = VerifyOtpUseCase;
