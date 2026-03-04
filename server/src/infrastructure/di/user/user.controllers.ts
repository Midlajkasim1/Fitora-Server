import { AuthController } from "@/presentation/controllers/user/user-auth.controller";
import { useCases } from "./user.usecases";
import { UserController } from "@/presentation/controllers/user/user.controller";
// import { sharedUseCases } from "../shared/shared.usecase";
import { UserSpecializationController } from "@/presentation/controllers/user/userSpecialization.controller";
import { UserSubscriptionController } from "@/presentation/controllers/user/user-subscription.controller";

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
  userController: new UserController(
  useCases.getUserProfileUseCase,
  useCases.updateUserProfileUseCase,
  useCases.uploadProfileImageUseCase,
  useCases.changePasswordUseCase,
  
  ),
  userSpecializationController:new UserSpecializationController(
    useCases.getAllSpecializationUseCase,
    useCases.getUserSpecializationById,
    useCases.getWorkoutBySpecializationById,
    useCases.getWorkoutSelectionUseCase

    
  ),
  userSubscriptionController : new UserSubscriptionController(
    useCases.getUserSubscriptionUseCase,
    useCases.getUserSubscriptionByIdUseCase

  )

};
