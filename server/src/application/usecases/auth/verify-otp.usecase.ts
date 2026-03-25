import { OtpSessionDTO } from "@/application/dto/auth/request/otp-session.dto";
import { VerifyOtpDTO } from "@/application/dto/auth/request/verify-otp.dto";
import { VerifyOtpResponseDTO } from "@/application/dto/auth/response/verify-otp.dto";
import { IBaseUseCase } from "@/application/interfaces/base-usecase.interface";
import { AUTH_MESSAGES } from "@/domain/constants/messages.constants";
import { UserEntity } from "@/domain/entities/user/user.entity";
import { IUserRepository } from "@/domain/interfaces/repositories/user.repository";
import { IOtpStore } from "@/domain/interfaces/services/otp-store.interface";
import { ITokenService } from "@/domain/interfaces/services/token.interface";

export class VerifyOtpUseCase implements IBaseUseCase<VerifyOtpDTO,VerifyOtpResponseDTO> {
  constructor(
    private readonly _otpStore: IOtpStore,
    private readonly _userRepository: IUserRepository,
    private readonly _tokenService: ITokenService
  ) {}

  async execute(dto:VerifyOtpDTO):Promise<VerifyOtpResponseDTO> {
    const redisKey = `otp:register:${dto.email}`;

    const stored = await this._otpStore.get<OtpSessionDTO>(redisKey);
    if (!stored) {
      throw new Error(AUTH_MESSAGES.OTPS_EXPIRED);
    }
    if (!stored.email || !stored.role) {
      throw new Error(AUTH_MESSAGES.SIGNUP_INVALID);
    }

    if (stored.otp !==dto.otp) {
      throw new Error(AUTH_MESSAGES.OTP_INVALID);
    }

 const userEntity = UserEntity.create({
      email: stored.email,
      firstName: stored.firstName,
      lastName: stored.lastName,
      phone: stored.phone,
      role: stored.role,
      isEmailVerified: true,
    });

  const createdUser = await this._userRepository.createWithPassword(userEntity, stored.password);

    const accessToken = this._tokenService.generateAccessToken({ 
      userId: createdUser.id!, 
      email: createdUser.email, 
      name:createdUser.firstName,
      role: createdUser.role 
    });
    const refreshToken = this._tokenService.generateRefreshToken({ userId: createdUser.id! });

    await this._otpStore.delete(redisKey);

    return new VerifyOtpResponseDTO({
      message: AUTH_MESSAGES.VERIFICATION_SUCCESS,
      accessToken,
      refreshToken,
      user: {
        id:createdUser.id!,
        email: createdUser.email,
        role: createdUser.role,
        isOnboardingRequired: true 
      }
    });

  }
}
