import { loginDTO } from "@/application/dto/auth/login.dto";
import { IPasswordHasher } from "@/domain/interfaces/password.interface";
import { IUserRepository } from "@/domain/interfaces/repositories/user.repository";
import { ITokenService } from "@/domain/interfaces/token.interface";

export class LoginUseCase{
   constructor(
     private readonly userRepository:IUserRepository,
    private readonly passwordService:IPasswordHasher,
    private readonly tokenService:ITokenService,
   ){}

   async execute(dto: loginDTO) {
    const user = await this.userRepository.findByEmail(dto.email);

    if (!user) throw new Error("Invalid credentials");
    if (!user.isverfied()) throw new Error("Account not verified");
    if (!user.isActive()) throw new Error("Account blocked");

    const isMatch = await this.passwordService.compare(
      dto.password,
      user.password
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
      message: "Login successful",
    };
  }
}
