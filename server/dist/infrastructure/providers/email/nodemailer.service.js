"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodemailerEmailService = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
class NodemailerEmailService {
    transporter = nodemailer_1.default.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });
    async sendOtp(email, otp) {
        await this.transporter.sendMail({
            from: `"Fitora" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Your OTP Verification Code",
            text: `Your OTP is ${otp}. It will expire in 5 minutes.`,
        });
    }
}
exports.NodemailerEmailService = NodemailerEmailService;
