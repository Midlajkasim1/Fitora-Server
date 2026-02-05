import { AdminLoginUseCase } from "@/application/usecases/admin/admin-login.usecase";
import { JwtTokenService } from "@/infrastructure/providers/auth/jwt-token.service";
import { BcryptPasswordHasher } from "@/infrastructure/providers/crypto/bcrypt-password.service";
import { adminRepositories } from "./admin.repositories";
import { GetAllUsersUseCase } from "@/application/usecases/admin/get-all-users.usecase";
import { UserBlockUsecase } from "@/application/usecases/admin/user-block.usecase";
import { GetAllTrainersUseCase } from "@/application/usecases/admin/get-all-trainers.usecase";
import { TrainerBlockUseCase } from "@/application/usecases/admin/trainer-block.usecase";
import { AdminRefreshUseCase } from "@/application/usecases/admin/admin-refresh.usecase";
import { GetAdminMeUseCase } from "@/application/usecases/admin/get-admin-me.usecase";

const tokenService = new JwtTokenService();
const passwordHasher = new BcryptPasswordHasher();

export const adminUseCases = {
  adminLoginUseCase: new AdminLoginUseCase(
    adminRepositories.adminRepository,
    passwordHasher,
    tokenService
  ),
  getAllUsersUseCase: new GetAllUsersUseCase(
    adminRepositories.userRepository
  ),
  blockUserUseCase: new UserBlockUsecase(
    adminRepositories.userRepository
  ),
  getAllTrainersUseCase:new GetAllTrainersUseCase(
    adminRepositories.userRepository
  ),
  blockTrainersUseCase: new TrainerBlockUseCase(
    adminRepositories.userRepository
  ),
  adminRefreshUseCase: new AdminRefreshUseCase(
    adminRepositories.adminRepository,
    tokenService
  ),
  getAdminMeUseCase: new GetAdminMeUseCase(
    adminRepositories.adminRepository
  )
};
