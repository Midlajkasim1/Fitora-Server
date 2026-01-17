import { RegisterDTO } from "@/application/dto/auth/auth.dto";
import { IOtpStore } from "@/domain/interfaces/otp-store.interface";
import { IEmailService } from "@/domain/interfaces/email-service.interface";
import { PasswordHasher } from "@/shared/utils/password-hash";
import { randomInt } from "crypto";

export class RegisterUseCase {
  constructor(
    private readonly otpStore: IOtpStore,
    private readonly emailService: IEmailService
  ) {}

  async execute(dto: RegisterDTO) {
    const { email, password, confirmPassword } = dto;

    if (password !== confirmPassword) {
      throw new Error("Passwords do not match");
    }

    const hashedPassword = await PasswordHasher.hash(password);

    const otp = randomInt(100000, 999999).toString();
    const ttl = 300;

    const redisKey = `otp:register:${email}`;

    await this.otpStore.save(
      redisKey,
      {
        ...dto,
        password: hashedPassword,
        otp,
      },
      ttl
    );
   console.log('otp is:',otp)
    await this.emailService.sendOtp(email, otp);

    return { message: "OTP sent to your email" };
  }
}
