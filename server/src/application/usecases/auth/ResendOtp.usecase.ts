import { IEmailService } from "@/domain/interfaces/email-service.interface";
import { IOtpStore } from "@/domain/interfaces/otp-store.interface";

export class ResendOtpUseCase {
  constructor(
    private readonly otpStore: IOtpStore,
    private readonly emailService: IEmailService
  ) {}

  async execute(email: string) {
    const registerKey = `otp:register:${email}`;
    const resendKey = `otp:resend:${email}`;

    const existingData = await this.otpStore.get<any>(registerKey);
    if (!existingData) {
      throw new Error("Registration session expired. Please register again.");
    }

    const cooldown = await this.otpStore.get(resendKey);
    if (cooldown) {
      throw new Error("Please wait before requesting a new OTP");
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
   console.log('otp : ',otp)
   
    await this.otpStore.save(
      registerKey,
      { 
        ...existingData, 
        otp            
      }, 
      300 
    );

    await this.otpStore.save(resendKey, true, 60);
    await this.emailService.sendOtp(email, otp);

    return { message: "OTP resent successfully" };
  }
}