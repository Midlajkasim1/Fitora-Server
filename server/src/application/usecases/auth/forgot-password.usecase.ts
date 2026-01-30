import { IUserRepository } from "@/domain/interfaces/repositories/user.repository";
import { IOtpStore } from "@/domain/interfaces/otp-store.interface";
import { IEmailService } from "@/domain/interfaces/email-service.interface";
import { randomInt } from "crypto";
import { IBaseUseCase } from "@/application/interfaces/base-usecase.interface";
import { ForgotPasswordRequestDTO } from "@/application/dto/auth/request/forgot-password.dto";
import { ForgotPasswordResponseDTO } from "@/application/dto/auth/response/forgot-password.dto";
import { logger } from "@/infrastructure/providers/loggers/logger";

export class ForgotPasswordUseCase implements IBaseUseCase<ForgotPasswordRequestDTO, ForgotPasswordResponseDTO> {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly otpStore: IOtpStore,
    private readonly emailService: IEmailService
  ) {}

  async execute(dto: ForgotPasswordRequestDTO): Promise<ForgotPasswordResponseDTO> {
    const user = await this.userRepository.findEntityByEmail(dto.email);
    if (!user) return { message: "If an account exists, an OTP has been sent." };

    const otp = randomInt(100000, 999999).toString();
    const redisKey = `otp:forgot-password:${dto.email}`;
     logger.info(otp);
    await this.otpStore.save(redisKey, { email: dto.email, otp }, 600);
    await this.emailService.sendOtp(dto.email, otp);

    return { message: "If an account exists, an OTP has been sent." };
  }
}