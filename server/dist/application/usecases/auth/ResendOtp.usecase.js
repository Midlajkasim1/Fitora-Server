"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResendOtpUseCase = void 0;
class ResendOtpUseCase {
    otpStore;
    emailService;
    constructor(otpStore, emailService) {
        this.otpStore = otpStore;
        this.emailService = emailService;
    }
    async execute(email) {
        const registerKey = `otp:register:${email}`;
        const resendKey = `otp:resend:${email}`;
        const existingData = await this.otpStore.get(registerKey);
        if (!existingData) {
            throw new Error("Registration session expired. Please register again.");
        }
        const cooldown = await this.otpStore.get(resendKey);
        if (cooldown) {
            throw new Error("Please wait before requesting a new OTP");
        }
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        console.log('otp : ', otp);
        await this.otpStore.save(registerKey, {
            ...existingData,
            otp
        }, 300);
        await this.otpStore.save(resendKey, true, 60);
        await this.emailService.sendOtp(email, otp);
        return { message: "OTP resent successfully" };
    }
}
exports.ResendOtpUseCase = ResendOtpUseCase;
