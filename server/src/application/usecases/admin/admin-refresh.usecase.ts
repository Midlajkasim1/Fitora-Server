import { RefreshTokenRequestDTO } from "@/application/dto/auth/request/refresh-token.dto";
import { IBaseUseCase } from "@/application/interfaces/base-usecase.interface";
import { AdminRole } from "@/domain/constants/auth.constants";
import { AUTH_MESSAGES } from "@/domain/constants/messages.constants";
import { IAdminRepository } from "@/domain/interfaces/repositories/admin.repository";
import { ITokenService } from "@/domain/interfaces/services/token.interface";
import { AdminRefreshResponseDTO } from "../../dto/admin/response/admin-refresh.dto";

export class AdminRefreshUseCase implements IBaseUseCase<RefreshTokenRequestDTO, AdminRefreshResponseDTO> {
  constructor(
    private readonly _adminRepository: IAdminRepository,
    private readonly _tokenService: ITokenService
  ) {}

  async execute(dto:RefreshTokenRequestDTO): Promise<AdminRefreshResponseDTO> {
    const decoded = this._tokenService.verifyRefreshToken(dto.refreshToken);
    const admin = await this._adminRepository.findById(decoded.userId);
    if (!admin || !admin.isActive()) {
      throw new Error(AUTH_MESSAGES.SESSION_INVALID);
    }

    const accessToken = this._tokenService.generateAccessToken({
      userId: admin.id!,
      email: admin.email,
      name:"Admin",
      role: AdminRole.ADMIN,
    });

    return new AdminRefreshResponseDTO({ accessToken });
  }
}