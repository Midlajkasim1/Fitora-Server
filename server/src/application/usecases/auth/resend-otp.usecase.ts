import { OtpSessionDTO } from "@/application/dto/auth/request/otp-session.dto";
import { ResendOtpDTO } from "@/application/dto/auth/request/resend-otp.dto";
import { ResendOtpResponseDTO } from "@/application/dto/auth/response/resend-otp.dto";
import { IBaseUseCase } from "@/application/interfaces/base-usecase.interface";
import { AUTH_MESSAGES } from "@/domain/constants/messages.constants";
import { IEmailService } from "@/domain/interfaces/email-service.interface";
import { IOtpStore } from "@/domain/interfaces/otp-store.interface";
import { logger } from "@/infrastructure/providers/loggers/logger";
import { randomInt } from "crypto";

export class ResendOtpUseCase implements IBaseUseCase<ResendOtpDTO, ResendOtpResponseDTO> {
  constructor(
    private readonly _otpStore: IOtpStore,
    private readonly _emailService: IEmailService
  ) {}

  async execute(dto:ResendOtpDTO):Promise<ResendOtpResponseDTO> {
    const registerKey = `otp:register:${dto.email}`;
    const resendKey = `otp:resend:${dto.email}`;

    const session = await this._otpStore.get<OtpSessionDTO>(registerKey);
    if (!session) {
      throw new Error(AUTH_MESSAGES.SESSION_EXPIRED);
    }

    const cooldown = await this._otpStore.get<boolean>(resendKey);
    if (cooldown) {
      throw new Error(AUTH_MESSAGES.OTP_COOLDOWN);
    }

const otp = randomInt(100000, 1000000).toString();
       logger.info("otp : ",otp);
   
    await this._otpStore.save(
      registerKey,
      { 
        ...session, 
        otp            
      }, 
      300 
    );

    await this._otpStore.save(resendKey, true, 60);
    await this._emailService.sendOtp(dto.email, otp);
    return { message: AUTH_MESSAGES.OTP_SENT };

  }
}