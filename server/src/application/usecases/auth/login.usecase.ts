import { LoginResponseDTO } from "@/application/dto/auth/response/login.dto";
import { LoginDTO } from "@/application/dto/auth/request/login.dto";
import { IPasswordHasher } from "@/domain/interfaces/password.interface";
import { IUserRepository } from "@/domain/interfaces/repositories/user.repository";
import { ITokenService } from "@/domain/interfaces/token.interface";
import { IBaseUseCase } from "@/application/interfaces/base-usecase.interface";
import { ITrainerRepository } from "@/domain/interfaces/repositories/onboarding/itrainer.repository";
import { AUTH_MESSAGES } from "@/domain/constants/messages.constants";
import { UserRole } from "@/domain/constants/auth.constants";

export class LoginUseCase implements IBaseUseCase<LoginDTO, LoginResponseDTO>{
   constructor(
     private readonly _userRepository:IUserRepository,
     private readonly _trainerRepository:ITrainerRepository,
    private readonly _passwordService:IPasswordHasher,
    private readonly _tokenService:ITokenService,
   ){}

  async execute(dto: LoginDTO):Promise<LoginResponseDTO> {
  const result = await this._userRepository.findByEmail(dto.email);
  if (!result) throw new Error(AUTH_MESSAGES.INVALID_CREDENTIALS);

  const { user, passwordHash } = result;

  if (!user.isverfied()) throw new Error(AUTH_MESSAGES.ACCOUNT_NOT_VERIFIED);
  if (!user.isActive()) throw new Error(AUTH_MESSAGES.ACCOUNT_BLOCKED);

  const isMatch = await this._passwordService.compare(
    dto.password,
    passwordHash
  );

  if (!isMatch) throw new Error(AUTH_MESSAGES.INVALID_CREDENTIALS);
let approvalStatus;
    if (user.role === UserRole.TRAINER) {
      const trainer = await this._trainerRepository.findByUserId(user.id!);
      approvalStatus = trainer?.approvalStatus; 
    }
  return {
   accessToken: this._tokenService.generateAccessToken({
        userId: user.id!,
        email: user.email,
        role: user.role,
      }),
      refreshToken: this._tokenService.generateRefreshToken({ userId: user.id! }),
      userId: user.id!,
      role: user.role,
      isOnboardingRequired: user.isOnboardingRequired,
      approval_status: approvalStatus,

  };
}

}
