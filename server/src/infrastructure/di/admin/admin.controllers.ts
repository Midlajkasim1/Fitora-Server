import { AdminAuthController } from "@/presentation/controllers/admin-auth.controller";
import { adminUseCases } from "./admin.usecases";

export const adminControllers = {
  adminAuthController: new AdminAuthController(
    adminUseCases.adminLoginUseCase
  ),
};
