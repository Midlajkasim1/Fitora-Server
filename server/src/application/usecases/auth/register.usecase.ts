import { IOtpStore } from "@/domain/interfaces/otp-store.interface";
import { IEmailService } from "@/domain/interfaces/email-service.interface";
import { randomInt } from "crypto";
import { IPasswordHasher } from "@/domain/interfaces/password.interface";
import { RegisterResponseDTO } from "@/application/dto/auth/response/register.dto";
import { RegisterDTO } from "@/application/dto/auth/request/register.dto";
export class RegisterUseCase {
  constructor(
    private readonly otpStore: IOtpStore,
    private readonly emailService: IEmailService,
    private readonly passwordHasher:IPasswordHasher
  ) {}

  async execute(dto: RegisterDTO):Promise<RegisterResponseDTO> {

    const hashedPassword = await this.passwordHasher.hash(dto.password)

    const otp = randomInt(100000, 999999).toString();
    const ttl = 300;

    const redisKey = `otp:register:${dto.email}`;

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
    await this.emailService.sendOtp(dto.email, otp);
      return { message: "OTP sent successfully" };


  }
}
