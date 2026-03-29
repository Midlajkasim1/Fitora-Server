import { AuthController } from "@/presentation/controllers/user/user-auth.controller";
import { paymentProvider, useCases } from "./user.usecases";
import { UserController } from "@/presentation/controllers/user/user.controller";
import { UserSpecializationController } from "@/presentation/controllers/user/userSpecialization.controller";
import { UserSubscriptionController } from "@/presentation/controllers/user/user-subscription.controller";
import { HealthMetricsController } from "@/presentation/controllers/user/user-health-metrics.controller";
import { UserAdvertisementController } from "@/presentation/controllers/user/user-advertisement.controller";
import { UserSlotController } from "@/presentation/controllers/user/user-slot.controller";
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
    useCases.getUserSubscriptionPlanUseCase,
    useCases.getUserSubscriptionPlanByIdUseCase,
    useCases.purchaseSubscriptionPlan,
    useCases.handleWebhookUseCase,
    paymentProvider,
    useCases.checkActiveSubscriptionUser,
    useCases.cancelSubscriptionUseCase,
    useCases.getPurchaseHistoryUseCase
    


  ),
  userHealthMetricsController: new HealthMetricsController(
    useCases.clientHealthMetricsUseCase,
    useCases.checkHealthMetricsUseCase
  ),
  
  userAdvertisementController:new UserAdvertisementController(
    useCases.getActiveAdvertisementUseCase
  ),
  userSlotsController:new UserSlotController(
    useCases.getAvailableSlotsUseCase,
    useCases.bookSlotUseCase,
    useCases.cancelSlotUseCase,
    useCases.getUserUpcomingUseCase
  )


};
