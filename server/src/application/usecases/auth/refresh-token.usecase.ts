import { RefreshTokenRequestDTO } from "@/application/dto/auth/request/refresh-token.dto";
import { RefreshTokenResponseDTO } from "@/application/dto/auth/response/refresh-token.dto";
import { IBaseUseCase } from "@/application/interfaces/base-usecase.interface";
import { UserStatus } from "@/domain/constants/auth.constants";
import { AUTH_MESSAGES } from "@/domain/constants/messages.constants";
import { IUserRepository } from "@/domain/interfaces/repositories/user.repository";
import { ITokenService } from "@/domain/interfaces/services/token.interface";

export class RefreshTokenUseCase implements IBaseUseCase<RefreshTokenRequestDTO,RefreshTokenResponseDTO> {
  constructor(
    private readonly _userRepository: IUserRepository,
    private readonly _tokenService: ITokenService
  ) {}

  async execute(dto: { refreshToken: string }) {
    const decoded = this._tokenService.verifyRefreshToken(dto.refreshToken);
    const user = await this._userRepository.findById(decoded.userId);

    if (!user || user.status !== UserStatus.ACTIVE) {
      throw new Error(AUTH_MESSAGES.INVALID_SESSION);
    }

    const accessToken = this._tokenService.generateAccessToken({
      userId: user.id!,
      email: user.email,
      role: user.role
    });

    return { accessToken };
  }
}