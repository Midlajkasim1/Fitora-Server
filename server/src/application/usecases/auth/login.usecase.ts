import { LoginResponseDTO } from "@/application/dto/auth/response/login.dto";
import { LoginDTO } from "@/application/dto/auth/request/login.dto";
import { IPasswordHasher } from "@/domain/interfaces/password.interface";
import { IUserRepository } from "@/domain/interfaces/repositories/user.repository";
import { ITokenService } from "@/domain/interfaces/token.interface";
import { IBaseUseCase } from "@/application/interfaces/base-usecase.interface";

export class LoginUseCase implements IBaseUseCase<LoginDTO, LoginResponseDTO>{
   constructor(
     private readonly userRepository:IUserRepository,
    private readonly passwordService:IPasswordHasher,
    private readonly tokenService:ITokenService,
   ){}

  async execute(dto: LoginDTO):Promise<LoginResponseDTO> {
  const result = await this.userRepository.findByEmail(dto.email);
  if (!result) throw new Error("Invalid credentials");

  const { user, passwordHash } = result;

  if (!user.isverfied()) throw new Error("Account not verified");
  if (!user.isActive()) throw new Error("Account blocked");

  const isMatch = await this.passwordService.compare(
    dto.password,
    passwordHash
  );

  if (!isMatch) throw new Error("Invalid credentials");

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
    isOnboardingRequired: !user.phone,

  };
}

}
