import { AdminLoginUseCase } from "@/application/usecases/admin/admin-login.usecase";
import { JwtTokenService } from "@/infrastructure/providers/auth/jwt-token.service";
import { BcryptPasswordHasher } from "@/infrastructure/providers/crypto/bcrypt-password.service";
import { adminRepositories } from "./admin.repositories";

const tokenService = new JwtTokenService();
const passwordHasher = new BcryptPasswordHasher();

export const adminUseCases = {
  adminLoginUseCase: new AdminLoginUseCase(
    adminRepositories.adminRepository,
    passwordHasher,
    tokenService
  ),
};
