import { IAdminRepository } from "@/domain/interfaces/repositories/admin.repository";
import { IPasswordHasher } from "@/domain/interfaces/password.interface";
import { ITokenService } from "@/domain/interfaces/token.interface";
import { AdminLoginDTO } from "@/application/dto/admin/admin-login.dto";

export class AdminLoginUseCase {
  constructor(
    private readonly adminRepository: IAdminRepository,
    private readonly passwordHasher: IPasswordHasher,
    private readonly tokenService: ITokenService
  ) {}

  async execute(dto: AdminLoginDTO) {
    const result = await this.adminRepository.findByEmail(dto.email);
    if (!result) throw new Error("Invalid credentials");

    const { admin, passwordHash } = result;

    if (!admin.isActive()) {
      throw new Error("Admin blocked");
    }

    const isMatch = await this.passwordHasher.compare(
      dto.password,
      passwordHash
    );

    if (!isMatch) throw new Error("Invalid credentials");

    return {
      accessToken: this.tokenService.generateAccessToken({
        userId: admin.id!,
        email: admin.email,
        role: "admin",
      }),
      message: "Admin login successful",
    };
  }
}
