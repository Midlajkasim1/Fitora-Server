import { AdminAuthController } from "@/presentation/controllers/admin/admin-auth.controller";
import { adminUseCases } from "./admin.usecases";
import { AdminUserController } from "@/presentation/controllers/admin/admin-user.controller";
import { AdminTrainerController } from "@/presentation/controllers/admin/admin-trainer.controller";
import { SpecializationController } from "@/presentation/controllers/admin/specialization.controller";
import { WorkoutController } from "@/presentation/controllers/admin/admin-workout.controller";
import { AdminSubscriptionController } from "@/presentation/controllers/admin/admin-subscription.controller";

export const adminControllers = {
  adminAuthController: new AdminAuthController(
    adminUseCases.adminLoginUseCase,
    adminUseCases.adminRefreshUseCase,
    adminUseCases.getAdminMeUseCase,

    
  ),
  adminUserController: new AdminUserController(
    adminUseCases.getAllUsersUseCase,
    adminUseCases.blockUserUseCase
  ),
  adminTrainerController: new AdminTrainerController(
    adminUseCases.getAllTrainersUseCase,
    adminUseCases.blockTrainersUseCase,
    adminUseCases.getTrainerVerficationUseCase,
    adminUseCases.updateTrainerApprovalStatusUseCase,
    adminUseCases.getTrainerVerificationByIdUsecase
  ),

  specializationController : new SpecializationController(
     adminUseCases.createSpecialisationUseCase,
     adminUseCases.updateSpecialisationUseCase,
     adminUseCases.getAllSpecializationUseCase,
     adminUseCases.blockSpecializationUseCase,
     adminUseCases.getSpecializationByIdUseCase
     
     
  ),
  workoutController : new WorkoutController(
    adminUseCases.createWorkoutUseCase,
    adminUseCases.getAllWorkoutUsecase,
    adminUseCases.getWorkoutByIdUseCase,
    adminUseCases.updateWorkoutUseCase,
    adminUseCases.updateWorkoutStatusUseCase
  ),
  subscriptionController: new AdminSubscriptionController(
    adminUseCases.createSubscriptionPlanUseCase,
    adminUseCases.getSubscriptionPlanUseCase,
    adminUseCases.updateSubscriptionPlanUseCase,
    adminUseCases.updateSubscriptionPlanStatus,
    adminUseCases.getSubscriptionPlanByIdUseCase
  )
 
};
