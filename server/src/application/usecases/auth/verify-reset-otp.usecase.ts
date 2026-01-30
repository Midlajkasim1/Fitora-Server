
import { VerifyResetOtpDTO } from "@/application/dto/auth/request/verify-reset-otp.dto";
import { VerifyResetOtpResponseDTO } from "@/application/dto/auth/response/verify-reset-otp.dto";
import { IBaseUseCase } from "@/application/interfaces/base-usecase.interface";
import { IOtpStore } from "@/domain/interfaces/otp-store.interface";
import { randomBytes } from "crypto";

export class VerifyResetOtpUseCase implements IBaseUseCase<VerifyResetOtpDTO, VerifyResetOtpResponseDTO> {
  constructor(private readonly otpStore: IOtpStore) {}

  async execute(dto: VerifyResetOtpDTO): Promise<VerifyResetOtpResponseDTO> {
    const redisKey = `otp:forgot-password:${dto.email}`;
    const stored = await this.otpStore.get<{ email: string; otp: string }>(redisKey);

    if (!stored || stored.otp !== dto.otp) throw new Error("Invalid or expired OTP");

    const resetToken = randomBytes(32).toString("hex");
    const sessionKey = `reset-session:${resetToken}`;

    await this.otpStore.save(sessionKey, { email: dto.email }, 900); 
    await this.otpStore.delete(redisKey);

    return { resetToken };
  }
}