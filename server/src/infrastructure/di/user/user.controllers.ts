import { AuthController } from "@/presentation/controllers/user/user-auth.controller";
import { useCases } from "./user.usecases";

export const userControllers = {
  authController: new AuthController(
    useCases.registerUseCase,
    useCases.verifyOtpUseCase,
    useCases.resendOtpUseCase,
    useCases.loginUseCase,
    useCases.googleAuthUseCase,
    useCases.forgotPasswordUseCase, 
    useCases.verifyResetOtpUseCase, 
    useCases.resetPasswordUseCase,
    useCases.refreshTokenUseCase,
    useCases.getMeUseCase
  ),
};
