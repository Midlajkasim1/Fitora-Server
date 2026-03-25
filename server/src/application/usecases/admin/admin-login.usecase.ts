import { AdminLoginDTO } from "@/application/dto/admin/request/admin-login.dto";
import { AdminLoginResponseDTO } from "@/application/dto/admin/response/admin-login.dto";
import { IBaseUseCase } from "@/application/interfaces/base-usecase.interface";
import { AdminRole } from "@/domain/constants/auth.constants";
import { AUTH_MESSAGES } from "@/domain/constants/messages.constants";
import { IAdminRepository } from "@/domain/interfaces/repositories/admin.repository";
import { IPasswordHasher } from "@/domain/interfaces/services/password.interface";
import { ITokenService } from "@/domain/interfaces/services/token.interface";

export class AdminLoginUseCase implements IBaseUseCase<AdminLoginDTO,AdminLoginResponseDTO>{
  constructor(
    private readonly _adminRepository: IAdminRepository,
    private readonly _passwordHasher: IPasswordHasher,
    private readonly _tokenService: ITokenService
  ) {}

  async execute(dto: AdminLoginDTO):Promise<AdminLoginResponseDTO> {
    const result = await this._adminRepository.findByEmail(dto.email);
    if (!result) throw new Error(AUTH_MESSAGES.INVALID_CREDENTIALS);

    const { admin, passwordHash } = result;

    if (!admin.isActive()) {
      throw new Error(AUTH_MESSAGES.ADMIN_BLOCK);
    }

    const isMatch = await this._passwordHasher.compare(
      dto.password,
      passwordHash
    );

    if (!isMatch) throw new Error(AUTH_MESSAGES.INVALID_CREDENTIALS);

    return new AdminLoginResponseDTO({
      accessToken: this._tokenService.generateAccessToken({
        userId: admin.id!,
        email: admin.email,
        name:"Admin",
        role: AdminRole.ADMIN,
      }),
      refreshToken:this._tokenService.generateRefreshToken({
        userId:admin.id!,
      }),
    });
  }
}
