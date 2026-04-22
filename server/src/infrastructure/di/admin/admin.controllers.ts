import { AdminAuthController } from "@/presentation/controllers/admin/admin-auth.controller";
import { adminUseCases } from "./admin.usecases";
import { AdminUserController } from "@/presentation/controllers/admin/admin-user.controller";
import { AdminTrainerController } from "@/presentation/controllers/admin/admin-trainer.controller";
import { SpecializationController } from "@/presentation/controllers/admin/specialization.controller";
import { WorkoutController } from "@/presentation/controllers/admin/admin-workout.controller";
import { AdminSubscriptionController } from "@/presentation/controllers/admin/admin-subscription.controller";
import { AdvertisementController } from "@/presentation/controllers/admin/admin-advertisement.controller";
import { AdminReportController } from "@/presentation/controllers/admin/admin-report.controller";
import { AdminFinanceController } from "@/presentation/controllers/admin/admin-finance.controller";


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
  ),
  advertisementController:new AdvertisementController(
    adminUseCases.createAdvertisementUseCase,
    adminUseCases.updateAdvertisementUseCase,
    adminUseCases.getAllAdvertisementUseCase,
    adminUseCases.updateStatusAdvertisement,
    adminUseCases.getAdvertisementById
  ),
  adminReportController: new AdminReportController(
    adminUseCases.getReportsUseCase,
    adminUseCases.getReportSummaryUseCase,
    adminUseCases.updateReportStatusUseCase,
    adminUseCases.getReportByIdUseCase
  ),
  adminFinanceController: new AdminFinanceController(
    adminUseCases.getFinanceOverviewUseCase,
    adminUseCases.getRecentTransactionsUseCase,
    adminUseCases.generateFinanceReportUseCase
  )

 
};
