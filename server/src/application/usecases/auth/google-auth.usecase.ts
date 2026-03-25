import { GoogleDTO } from "@/application/dto/auth/request/google.dto";
import { GoogleLoginResponseDTO } from "@/application/dto/auth/response/google-login.dto";
import { IBaseUseCase } from "@/application/interfaces/base-usecase.interface";
import { UserRole } from "@/domain/constants/auth.constants"; //
import { AUTH_MESSAGES } from "@/domain/constants/messages.constants";
import { UserEntity } from "@/domain/entities/user/user.entity";
import { ITrainerRepository } from "@/domain/interfaces/repositories/onboarding/itrainer.repository";
import { IUserRepository } from "@/domain/interfaces/repositories/user.repository";
import { IGoogleTokenProvider } from "@/domain/interfaces/services/google-token.interface";
import { ITokenService } from "@/domain/interfaces/services/token.interface";

export class GoogleAuthUseCase implements IBaseUseCase<GoogleDTO, GoogleLoginResponseDTO> {
  constructor(
    private readonly _userRepository: IUserRepository,
    private readonly _trainerRepository: ITrainerRepository,
    private readonly _tokenService: ITokenService,
    private readonly _googleTokenProvider: IGoogleTokenProvider
  ) { }

  async execute(dto: GoogleDTO): Promise<GoogleLoginResponseDTO> {
    const googleUser = await this._googleTokenProvider.verifyIdToken(dto.idToken);

    let user = await this._userRepository.findEntityByEmail(googleUser.email);

    if (!user) {
      const newUser = UserEntity.create({
        email: googleUser.email,
        firstName: googleUser.firstName,
        lastName: googleUser.lastName,
        phone: "",
        role: dto.role,
        isEmailVerified: true,
      });

      user = await this._userRepository.createWithGoogle(newUser, googleUser.googleId);
    }
    if(!user.isActive()){
      throw new Error(AUTH_MESSAGES.ACCOUNT_BLOCKED);
    }


    let approvalStatus;
    if (user.role === UserRole.TRAINER) {
      const trainer = await this._trainerRepository.findByUserId(user.id!);
      approvalStatus = trainer?.approvalStatus;
    }
    const onboardingRequired = user.isOnboardingRequired;
     return new GoogleLoginResponseDTO( {
      accessToken: this._tokenService.generateAccessToken({
        userId: user.id!,
        email: user.email,
        name:user.firstName,
        role: user.role,
      }),
      refreshToken: this._tokenService.generateRefreshToken({
        userId: user.id!,
      }),
      role: user.role,
      isOnboardingRequired: onboardingRequired,
      user: {
        id: user.id!,
        email: user.email,
        role: user.role,
        isOnboardingRequired: onboardingRequired,
        approval_status: approvalStatus,
      }
    });
  }
}