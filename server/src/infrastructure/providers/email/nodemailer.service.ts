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

  async sendReportUpdateEmail(email: string, name: string, status: string, reason: string): Promise<void> {
    const isResolved = status.toLowerCase() === "resolved";
    const subject = isResolved ? "Incident Report Resolved" : "Incident Report Dismissed";
    
    await this.transporter.sendMail({
      from: `"Fitora Support" <${env.EMAIL_USER}>`,
      to: email,
      subject,
      html: `
        <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
          <h2 style="color: ${isResolved ? "#10b981" : "#ef4444"};">${subject}</h2>
          <p>Hi <strong>${name}</strong>,</p>
          <p>This is an update regarding the report you submitted.</p>
          <div style="background: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; font-size: 14px; color: #666; text-transform: uppercase; font-weight: bold; letter-spacing: 1px;">Status</p>
            <p style="margin: 5px 0 15px 0; font-size: 18px; font-weight: bold; color: ${isResolved ? "#10b981" : "#ef4444"}; font-style: italic;">${status}</p>
            
            <p style="margin: 0; font-size: 14px; color: #666; text-transform: uppercase; font-weight: bold; letter-spacing: 1px;">Admin Notes</p>
            <p style="margin: 5px 0 0 0; line-height: 1.6; font-style: italic;">"${reason || "No additional notes provided."}"</p>
          </div>
          <p>If you have any further questions, please contact our support team.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 12px; color: #999;">Best Regards,<br/>Fitora Administration Team</p>
        </div>
      `,
    });
  }
}

