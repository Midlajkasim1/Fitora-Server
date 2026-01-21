import { AuthController } from "@/presentation/controllers/user-auth.controller";
import { useCases } from "./user.usecases";

export const userControllers = {
  authController: new AuthController(
    useCases.registerUseCase,
    useCases.verifyOtpUseCase,
    useCases.loginUseCase,
    useCases.googleAuthUseCase
  ),
};
