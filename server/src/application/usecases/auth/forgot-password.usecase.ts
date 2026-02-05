import { IUserRepository } from "@/domain/interfaces/repositories/user.repository";
import { IOtpStore } from "@/domain/interfaces/otp-store.interface";
import { IEmailService } from "@/domain/interfaces/email-service.interface";
import { randomInt } from "crypto";
import { IBaseUseCase } from "@/application/interfaces/base-usecase.interface";
import { ForgotPasswordRequestDTO } from "@/application/dto/auth/request/forgot-password.dto";
import { ForgotPasswordResponseDTO } from "@/application/dto/auth/response/forgot-password.dto";
import { logger } from "@/infrastructure/providers/loggers/logger";
import { AUTH_MESSAGES } from "@/domain/constants/messages.constants";

export class ForgotPasswordUseCase implements IBaseUseCase<ForgotPasswordRequestDTO, ForgotPasswordResponseDTO> {
  constructor(
    private readonly _userRepository: IUserRepository,
    private readonly _otpStore: IOtpStore,
    private readonly _emailService: IEmailService
  ) {}

  async execute(dto: ForgotPasswordRequestDTO): Promise<ForgotPasswordResponseDTO> {
    const user = await this._userRepository.findEntityByEmail(dto.email);
if (!user) {
      throw new Error(AUTH_MESSAGES.USER_NOT_FOUND);
    }
    const otp = randomInt(100000, 999999).toString();
    const redisKey = `otp:forgot-password:${dto.email}`;
     logger.info(otp);
    await this._otpStore.save(redisKey, { email: dto.email, otp }, 600);
    await this._emailService.sendOtp(dto.email, otp);

    return { message: AUTH_MESSAGES.FORGOT_PASSWORD_SUCCESS };
  }
}