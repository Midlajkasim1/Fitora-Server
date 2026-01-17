import { AuthController } from "@/presentation/controllers/auth.controller";
import { useCases } from "./usecases";

export const controllers = {
  authController: new AuthController(
    useCases.registerUseCase,
    useCases.verifyOtpUseCase
  ),
};
