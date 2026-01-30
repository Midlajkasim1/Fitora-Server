import { OtpSessionDTO } from "@/application/dto/auth/request/otp-session.dto";
import { VerifyOtpDTO } from "@/application/dto/auth/request/verify-otp.dto";
import { VerifyOtpResponseDTO } from "@/application/dto/auth/response/verify-otp.dto";
import { IBaseUseCase } from "@/application/interfaces/base-usecase.interface";
import { UserEntity } from "@/domain/entities/user/user.entity";
import { IOtpStore } from "@/domain/interfaces/otp-store.interface";
import { IUserRepository } from "@/domain/interfaces/repositories/user.repository";
import { ITokenService } from "@/domain/interfaces/token.interface";

export class VerifyOtpUseCase implements IBaseUseCase<VerifyOtpDTO,VerifyOtpResponseDTO> {
  constructor(
    private readonly otpStore: IOtpStore,
    private readonly userRepository: IUserRepository,
    private readonly tokenService: ITokenService
  ) {}

  async execute(dto:VerifyOtpDTO):Promise<VerifyOtpResponseDTO> {
    const redisKey = `otp:register:${dto.email}`;

    const stored = await this.otpStore.get<OtpSessionDTO>(redisKey);
    if (!stored) {
      throw new Error("OTP expired or invalid");
    }
    if (!stored.email || !stored.role) {
      throw new Error("Invalid registration session. Please sign up again.");
    }

    if (stored.otp !==dto.otp) {
      throw new Error("Invalid OTP");
    }

 const userEntity = UserEntity.create({
      email: stored.email,
      firstName: stored.firstName,
      lastName: stored.lastName,
      phone: stored.phone,
      role: stored.role,
      isEmailVerified: true,
    });

  const createdUser = await this.userRepository.create(userEntity, stored.password);

    const accessToken = this.tokenService.generateAccessToken({ 
      userId: createdUser.id!, 
      email: createdUser.email, 
      role: createdUser.role 
    });
    const refreshToken = this.tokenService.generateRefreshToken({ userId: createdUser.id! });

    await this.otpStore.delete(redisKey);

    return {
      message: "Account verified successfully",
      accessToken,
      refreshToken,
      user: {
        email: createdUser.email,
        role: createdUser.role,
        isOnboardingRequired: true 
      }
    };

  }
}
