"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
class AuthController {
    registerUseCase;
    verifyOtpUseCase;
    resendOtpUseCase;
    loginUseCase;
    googleAuthUseCase;
    constructor(registerUseCase, verifyOtpUseCase, resendOtpUseCase, loginUseCase, googleAuthUseCase) {
        this.registerUseCase = registerUseCase;
        this.verifyOtpUseCase = verifyOtpUseCase;
        this.resendOtpUseCase = resendOtpUseCase;
        this.loginUseCase = loginUseCase;
        this.googleAuthUseCase = googleAuthUseCase;
    }
    async register(req, res) {
        try {
            const result = await this.registerUseCase.execute(req.body);
            return res.status(200).json({
                success: true,
                message: "OTP sent successfully",
            });
        }
        catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message || "Registration failed",
            });
        }
    }
    async verifyOtp(req, res) {
        try {
            const { email, otp } = req.body;
            const result = await this.verifyOtpUseCase.execute(email, otp);
            return res.status(200).json({
                success: true,
                message: result.message,
            });
        }
        catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message || "OTP verification failed",
            });
        }
    }
    async resendOtp(req, res) {
        try {
            const { email } = req.body;
            const result = await this.resendOtpUseCase.execute(email);
            return res.status(200).json({
                success: true,
                message: result.message,
            });
        }
        catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }
    async login(req, res) {
        try {
            const result = await this.loginUseCase.execute(req.body);
            return res.status(200).json({
                success: true,
                message: result.message,
                data: {
                    accessToken: result.accessToken,
                    refreshToken: result.refreshToken,
                    role: result.role
                }
            });
        }
        catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message || "Login failed",
            });
        }
    }
    async googleLogin(req, res) {
        try {
            const { idToken, role } = req.body;
            const result = await this.googleAuthUseCase.execute(idToken, role);
            // SET THE COOKIE ON THE BACKEND
            res.cookie('accessToken', result.accessToken, {
                httpOnly: true, // Protects from XSS
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 15 * 60 * 1000 // 15 mins
            });
            return res.status(200).json({
                success: true,
                data: {
                    role: result.role,
                    isOnboardingRequired: result.isOnboardingRequired //
                },
            });
        }
        catch (error) {
            return res.status(400).json({ success: false, message: error.message });
        }
    }
}
exports.AuthController = AuthController;
