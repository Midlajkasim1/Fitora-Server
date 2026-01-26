import { GoogleLoginResponseDTO } from "@/application/dto/auth/response/google-login.dto";
import { GoogleDTO } from "@/application/dto/auth/request/google.dto";
import { UserEntity } from "@/domain/entities/user.entity";
import { AuthProvider, UserRole } from "@/domain/constants/auth.constants"; //
import { IGoogleTokenProvider } from "@/domain/interfaces/google-token.interface";
import { ITokenService } from "@/domain/interfaces/token.interface";
import { IUserRepository } from "@/domain/interfaces/repositories/user.repository";
import { IBaseUseCase } from "@/application/interfaces/base-usecase.interface";

export class GoogleAuthUseCase implements IBaseUseCase<GoogleDTO, GoogleLoginResponseDTO>{
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly tokenService: ITokenService,
    private readonly googleTokenProvider: IGoogleTokenProvider
  ) {}

  async execute(dto: GoogleDTO): Promise<GoogleLoginResponseDTO> {
    const googleUser = await this.googleTokenProvider.verifyIdToken(dto.idToken);

    let user = await this.userRepository.findEntityByEmail(googleUser.email);

    if (!user) {
      const newUser = UserEntity.create({
        email: googleUser.email,
        firstName: googleUser.firstName,
        lastName: googleUser.lastName,
        phone: "",
        role: dto.role, 
        isEmailVerified: true,
      });

      user = await this.userRepository.create(newUser, "", {
        authProvider: AuthProvider.GOOGLE, 
        googleId: googleUser.googleId,
      });
    }

    return {
      accessToken: this.tokenService.generateAccessToken({
        userId: user.id!,
        email: user.email,
        role: user.role,
      }),
      refreshToken: this.tokenService.generateRefreshToken({
        userId: user.id!,
      }),
      role: user.role,
      isOnboardingRequired: !user.phone || user.phone === "", 
    };
  }
}