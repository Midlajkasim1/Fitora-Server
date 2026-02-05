import { IAdminRepository } from "@/domain/interfaces/repositories/admin.repository";
import { ITokenService } from "@/domain/interfaces/token.interface";
import { IBaseUseCase } from "@/application/interfaces/base-usecase.interface";
import { AdminRefreshResponseDTO } from "../../dto/admin/response/admin-refresh.dto";
import { AdminRole } from "@/domain/constants/auth.constants";
import { AUTH_MESSAGES } from "@/domain/constants/messages.constants";

export class AdminRefreshUseCase implements IBaseUseCase<string, AdminRefreshResponseDTO> {
  constructor(
    private readonly _adminRepository: IAdminRepository,
    private readonly _tokenService: ITokenService
  ) {}

  async execute(refreshToken: string): Promise<AdminRefreshResponseDTO> {
    const decoded = this._tokenService.verifyRefreshToken(refreshToken);

    const admin = await this._adminRepository.findById(decoded.userId);
    if (!admin || !admin.isActive()) {
      throw new Error(AUTH_MESSAGES.SESSION_INVALID);
    }

    const accessToken = this._tokenService.generateAccessToken({
      userId: admin.id!,
      email: admin.email,
      role: AdminRole.ADMIN,
    });

    return { accessToken };
  }
}