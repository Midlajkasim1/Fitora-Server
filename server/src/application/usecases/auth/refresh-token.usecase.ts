import { RefreshTokenRequestDTO } from "@/application/dto/auth/request/refresh-token.dto";
import { RefreshTokenResponseDTO } from "@/application/dto/auth/response/refresh-token.dto";
import { IBaseUseCase } from "@/application/interfaces/base-usecase.interface";
import { UserStatus } from "@/domain/constants/auth.constants";
import { IUserRepository } from "@/domain/interfaces/repositories/user.repository";
import { ITokenService } from "@/domain/interfaces/token.interface";

export class RefreshTokenUseCase implements IBaseUseCase<RefreshTokenRequestDTO,RefreshTokenResponseDTO> {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly tokenService: ITokenService
  ) {}

  async execute(dto: { refreshToken: string }) {
    const decoded = this.tokenService.verifyRefreshToken(dto.refreshToken);
    const user = await this.userRepository.findById(decoded.userId);

    if (!user || user.status !== UserStatus.ACTIVE) {
      throw new Error("Invalid session or blocked user");
    }

    const accessToken = this.tokenService.generateAccessToken({
      userId: user.id!,
      email: user.email,
      role: user.role
    });

    return { accessToken };
  }
}