
import { VerifyResetOtpDTO } from "@/application/dto/auth/request/verify-reset-otp.dto";
import { VerifyResetOtpResponseDTO } from "@/application/dto/auth/response/verify-reset-otp.dto";
import { IBaseUseCase } from "@/application/interfaces/base-usecase.interface";
import { AUTH_MESSAGES } from "@/domain/constants/messages.constants";
import { IOtpStore } from "@/domain/interfaces/services/otp-store.interface";
import { randomBytes } from "crypto";

export class VerifyResetOtpUseCase implements IBaseUseCase<VerifyResetOtpDTO, VerifyResetOtpResponseDTO> {
  constructor(private readonly _otpStore: IOtpStore) {}

  async execute(dto: VerifyResetOtpDTO): Promise<VerifyResetOtpResponseDTO> {
    const redisKey = `otp:forgot-password:${dto.email}`;
    const stored = await this._otpStore.get<{ email: string; otp: string }>(redisKey);

    if (!stored || stored.otp !== dto.otp) throw new Error(AUTH_MESSAGES.OTPS_EXPIRED);

    const resetToken = randomBytes(32).toString("hex");
    const sessionKey = `reset-session:${resetToken}`;

    await this._otpStore.save(sessionKey, { email: dto.email }, 900); 
    await this._otpStore.delete(redisKey);

    return { resetToken };
  }
}