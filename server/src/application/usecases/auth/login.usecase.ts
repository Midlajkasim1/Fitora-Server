import { LoginDTO } from "@/application/dto/auth/request/login.dto";
import { LoginResponseDTO } from "@/application/dto/auth/response/login.dto";
import { IBaseUseCase } from "@/application/interfaces/base.usecase.interface";
import { UserRole } from "@/domain/constants/auth.constants";
import { AUTH_MESSAGES } from "@/domain/constants/messages.constants";
import { ITrainerRepository } from "@/domain/interfaces/repositories/itrainer.repository";
import { IUserRepository } from "@/domain/interfaces/repositories/user.repository";
import { IPasswordHasher } from "@/domain/interfaces/services/password.interface";
import { ITokenService } from "@/domain/interfaces/services/token.interface";
import { CustomError } from "@/shared/errors/custom.error";
import { HttpStatus } from "@/domain/constants/http.status.constants";

export class LoginUseCase implements IBaseUseCase<LoginDTO, LoginResponseDTO>{
   constructor(
     private readonly _userRepository:IUserRepository,
     private readonly _trainerRepository:ITrainerRepository,
    private readonly _passwordService:IPasswordHasher,
    private readonly _tokenService:ITokenService,
   ){}

  async execute(dto: LoginDTO):Promise<LoginResponseDTO> {
  const result = await this._userRepository.findByEmail(dto.email);
  if (!result) throw new CustomError(AUTH_MESSAGES.INVALID_CREDENTIALS, HttpStatus.UNAUTHORIZED);

  const { user, passwordHash } = result;

  if (!user.isverfied()) throw new CustomError(AUTH_MESSAGES.ACCOUNT_NOT_VERIFIED, HttpStatus.BAD_REQUEST);
  if (!user.isActive()) throw new CustomError(AUTH_MESSAGES.ACCOUNT_BLOCKED, HttpStatus.FORBIDDEN);

  const isMatch = await this._passwordService.compare(
    dto.password,
    passwordHash
  );

  if (!isMatch) throw new CustomError(AUTH_MESSAGES.INVALID_CREDENTIALS, HttpStatus.UNAUTHORIZED);
let approvalStatus;
    if (user.role === UserRole.TRAINER) {
      const trainer = await this._trainerRepository.findByUserId(user.id!);
      approvalStatus = trainer?.approvalStatus; 
    }
  return new LoginResponseDTO( {
   accessToken: this._tokenService.generateAccessToken({
        userId: user.id!,  
        email: user.email,
        name:user.firstName,
        role: user.role,
      }),
      refreshToken: this._tokenService.generateRefreshToken({ userId: user.id! }),
      userId: user.id!,
      role: user.role,
      isOnboardingRequired: user.isOnboardingRequired,
      approval_status: approvalStatus,

  });
}

}
