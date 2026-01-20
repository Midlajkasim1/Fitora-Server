import nodemailer from "nodemailer";
import { IEmailService } from "@/domain/interfaces/email-service.interface";

export class NodemailerEmailService implements IEmailService {
  private transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  async sendOtp(email: string, otp: string): Promise<void> {
    await this.transporter.sendMail({
      from: `"Fitora" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your OTP Verification Code",
      text: `Your OTP is ${otp}. It will expire in 5 minutes.`,
    });
  }
}

