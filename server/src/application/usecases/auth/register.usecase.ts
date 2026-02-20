import { RegisterDTO } from "@/application/dto/auth/request/register.dto";
import { RegisterResponseDTO } from "@/application/dto/auth/response/register.dto";
import { IBaseUseCase } from "@/application/interfaces/base-usecase.interface";
import { AUTH_MESSAGES } from "@/domain/constants/messages.constants";
import { IUserRepository } from "@/domain/interfaces/repositories/user.repository";
import { IEmailService } from "@/domain/interfaces/services/email-service.interface";
import { IOtpStore } from "@/domain/interfaces/services/otp-store.interface";
import { IPasswordHasher } from "@/domain/interfaces/services/password.interface";
import { logger } from "@/infrastructure/providers/loggers/logger";
import { randomInt } from "crypto";
export class RegisterUseCase implements IBaseUseCase<RegisterDTO, RegisterResponseDTO> {
  constructor(
    private readonly _userRepository: IUserRepository,
    private readonly _otpStore: IOtpStore,
    private readonly _emailService: IEmailService,
    private readonly _passwordHasher: IPasswordHasher
  ) { }

  async execute(dto: RegisterDTO): Promise<RegisterResponseDTO> {

   const existingUser = await this._userRepository.findByEmail(dto.email);
    if (existingUser) {
      throw new Error(AUTH_MESSAGES.EMAIL_ALREADY_EXISTS);
    }
 
   
    const hashedPassword = await this._passwordHasher.hash(dto.password);

    const otp = randomInt(100000, 999999).toString();
    const ttl = 300;

    const redisKey = `otp:register:${dto.email}`;

    await this._otpStore.save(
      redisKey,
      {
        ...dto,
        password: hashedPassword,
        otp,
      },
      ttl
    );
    logger.info(`OTP generated: ${otp}`);
    await this._emailService.sendOtp(dto.email, otp);
    return { message: AUTH_MESSAGES.OTP_RESENT };


  }
}
