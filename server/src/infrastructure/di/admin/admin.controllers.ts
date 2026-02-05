import { AdminAuthController } from "@/presentation/controllers/admin/admin-auth.controller";
import { adminUseCases } from "./admin.usecases";
import { AdminUserController } from "@/presentation/controllers/admin/admin-user.controller";
import { AdminTrainerController } from "@/presentation/controllers/admin/admin-trainer.controller";

export const adminControllers = {
  adminAuthController: new AdminAuthController(
    adminUseCases.adminLoginUseCase,
    adminUseCases.adminRefreshUseCase,
    adminUseCases.getAdminMeUseCase
    
  ),
  adminUserController: new AdminUserController(
    adminUseCases.getAllUsersUseCase,
    adminUseCases.blockUserUseCase
  ),
  adminTrainerController: new AdminTrainerController(
    adminUseCases.getAllTrainersUseCase,
    adminUseCases.blockTrainersUseCase
  )
};
