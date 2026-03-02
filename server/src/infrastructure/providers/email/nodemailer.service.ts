import { IEmailService } from "@/domain/interfaces/services/email-service.interface";
import { env } from "@/infrastructure/config/env.config";
import nodemailer from "nodemailer";
export class NodemailerEmailService implements IEmailService {
  private transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: env.EMAIL_USER,
      pass: env.EMAIL_PASS,
    },
  });

  async sendOtp(email: string, otp: string): Promise<void> {
    await this.transporter.sendMail({
      from: `"Fitora" <${env.EMAIL_USER}>`,
      to: email,
      subject: "Your OTP Verification Code",
      text: `Your OTP is ${otp}. It will expire in 5 minutes.`,
    });
  }
  async sendTrainerApprovalEmail(email: string, name: string): Promise<void> {
    await this.transporter.sendMail({
       from: `"Fitora" <${env.EMAIL_USER}>`,
      to: email,
      subject: "Trainer Profile Approved ",
      html: `
        <h3>Hi ${name},</h3>
        <p>Your trainer profile has been <strong>approved</strong>.</p>
        <p>You can now start accepting client sessions.</p>
        <br/>
        <p>Best Regards,<br/>Fitora Team</p>
      `,
    });
  }
  async sendTrainerRejectEmail(email: string, name: string, reason: string): Promise<void> {
    await this.transporter.sendMail({
         from: `"Fitora" <${env.EMAIL_USER}>`,
      to: email,
      subject: "Trainer Verification Rejected",
      html: `
        <h3>Hi ${name},</h3>
        <p>Your trainer verification was <strong>rejected</strong>.</p>
        <p><strong>Reason:</strong> ${reason}</p>
        <p>Please correct the issue and resubmit your documents.</p>
        <br/>
        <p>Fitora Team</p>
      `,
    });
  }
}

