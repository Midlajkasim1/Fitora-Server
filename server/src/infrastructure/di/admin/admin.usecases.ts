import { AdminLoginUseCase } from "@/application/usecases/admin/admin-login.usecase";
import { AdminRefreshUseCase } from "@/application/usecases/admin/admin-refresh.usecase";
import { GetAdminMeUseCase } from "@/application/usecases/admin/get-admin-me.usecase";
import { GetAllTrainersUseCase } from "@/application/usecases/admin/get-all-trainers.usecase";
import { GetTrainerVerificationUseCase } from "@/application/usecases/admin/get-all-trainerVerfication.usecase";
import { GetAllUsersUseCase } from "@/application/usecases/admin/get-all-users.usecase";
import { GetTrainerVerificationByIdUseCase } from "@/application/usecases/admin/get-trainerVerificationById.usecase";
import { TrainerBlockUseCase } from "@/application/usecases/admin/trainer-block.usecase";
import { UpdateApprovalStatusUseCase } from "@/application/usecases/admin/update-trainerApprovalStatus.usecase";
import { UserBlockUsecase } from "@/application/usecases/admin/user-block.usecase";
import { CreateSpecializationUseCase } from "@/application/usecases/specialization/create-specialization.usecase";
import { GetAllSpecializationUsecase } from "@/application/usecases/specialization/get-all-specializations.usecase";
import { GetSpecializationByIdUseCase } from "@/application/usecases/specialization/get-specializationById.usecase";
import { BlockSpecializationUSeCase } from "@/application/usecases/specialization/specialization-block.usecase";
import { UpdateSpecializationUsecase } from "@/application/usecases/specialization/update-specialization.usecase";
import { CreateSubscriptionPlanUseCase } from "@/application/usecases/subscription/create-subscriptionPlan.usecase";
import { GetSubcriptionPlanUseCase } from "@/application/usecases/subscription/get-subcriptionPlan.usecase";
import { GetSubscriptionPlanByIdUseCase } from "@/application/usecases/subscription/get-subscriptionByIdPlan.usecase";
import { UpdateSubscriptionPlanUseCase } from "@/application/usecases/subscription/update-subscriptionPlan.usecase";
import { UpdateSubscriptionPlanStatusUseCase } from "@/application/usecases/subscription/updateStatus-subscriptionPlan.usecase";
import { CreateWorkoutUseCase } from "@/application/usecases/workout/create-workout.usecase";
import { GetAllWorkoutUseCase } from "@/application/usecases/workout/getAll-workout.usecase";
import { GetWorkoutByIdUseCase } from "@/application/usecases/workout/getWorkoutById.usecase";
import { UpdateWorkoutUseCase } from "@/application/usecases/workout/update-workout.usecase";
import { UpdateWorkoutStatusUseCase } from "@/application/usecases/workout/update-workoutStatus.usecase";
import { JwtTokenService } from "@/infrastructure/providers/auth/jwt-token.service";
import { BcryptPasswordHasher } from "@/infrastructure/providers/crypto/bcrypt-password.service";
import { NodemailerEmailService } from "@/infrastructure/providers/email/nodemailer.service";
import { S3StorageProvider } from "@/infrastructure/providers/storage/s3-storage.provider";
import { adminRepositories } from "./admin.repositories";
import { CreateAdvertisementUseCase } from "@/application/usecases/advertisement/create-advertisment.usecase";
import { UpdateAdvertisementUseCase } from "@/application/usecases/advertisement/update-advertisement.usecase";
import { GetAllAdvertisementUseCase } from "@/application/usecases/advertisement/get-All-advertisement.usecase";
import { UpdateStatusAdvertisementUseCase } from "@/application/usecases/advertisement/updateStatus-advertisement.usecase";
import { GetAdvertisementById } from "@/application/usecases/advertisement/get-advertisementById.usecase";
import { GetReportsUseCase } from "@/application/usecases/admin/report/get-reports.usecase";
import { GetReportSummaryUseCase } from "@/application/usecases/admin/report/get-report-summary.usecase";
import { UpdateReportStatusUseCase } from "@/application/usecases/admin/report/update-report-status.usecase";
import { GetReportByIdUseCase } from "@/application/usecases/admin/report/get-report-by-id.usecase";
import { GetFinanceOverviewUseCase } from "@/application/usecases/admin/finance/get-finance-overview.usecase";
import { GetRecentTransactionsUseCase } from "@/application/usecases/admin/finance/get-recent-transactions.usecase";
import { GenerateFinanceReportUseCase } from "@/application/usecases/admin/finance/generate-finance-report.usecase";
import { HandlePayoutUseCase } from "@/application/usecases/admin/finance/handle-payout.usecase";
import { GetAdminDashboardStatsUseCase } from "@/application/usecases/admin/get-admin-dashboard-stats.usecase";

import { socketEmitterProxy } from "@/infrastructure/providers/socket/socket-emitter";
import { trainerRepositories } from "../trainer/trainer.repositories";

const tokenService = new JwtTokenService();
const passwordHasher = new BcryptPasswordHasher();
const storageProvider = new S3StorageProvider();
const emailService = new NodemailerEmailService();


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
    adminRepositories.trainerDetailsRepository
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
  ),
  createSpecialisationUseCase: new CreateSpecializationUseCase(
    adminRepositories.specialisatonRepository,
    storageProvider

  ),
  updateSpecialisationUseCase: new UpdateSpecializationUsecase(
    adminRepositories.specialisatonRepository,
    storageProvider
  ),
  getAllSpecializationUseCase: new GetAllSpecializationUsecase(
    adminRepositories.specialisatonRepository
  ),
  blockSpecializationUseCase: new BlockSpecializationUSeCase(
    adminRepositories.specialisatonRepository
  ),
  getTrainerVerficationUseCase: new GetTrainerVerificationUseCase(
         adminRepositories.trainerDetailsRepository,
         adminRepositories.userRepository,
  ),
  updateTrainerApprovalStatusUseCase: new UpdateApprovalStatusUseCase(
    adminRepositories.userRepository,
    adminRepositories.trainerDetailsRepository,
    emailService
  ),
  getSpecializationByIdUseCase: new GetSpecializationByIdUseCase(
    adminRepositories.specialisatonRepository
  ),
  getTrainerVerificationByIdUsecase: new GetTrainerVerificationByIdUseCase(
    adminRepositories.trainerDetailsRepository,
    adminRepositories.userRepository,
    adminRepositories.specialisatonRepository
  ),
  createWorkoutUseCase : new CreateWorkoutUseCase(
    adminRepositories.workoutRepository,
    storageProvider
  ),
  getAllWorkoutUsecase: new GetAllWorkoutUseCase(
    adminRepositories.workoutRepository
  ),
  getWorkoutByIdUseCase:new GetWorkoutByIdUseCase(
    adminRepositories.workoutRepository
  ),
  updateWorkoutUseCase: new UpdateWorkoutUseCase(
    adminRepositories.workoutRepository,
    storageProvider
  ),
  updateWorkoutStatusUseCase: new UpdateWorkoutStatusUseCase(
    adminRepositories.workoutRepository
  ),
  createSubscriptionPlanUseCase: new CreateSubscriptionPlanUseCase(
    adminRepositories.subcriptionPlanRepository
  ),
  getSubscriptionPlanUseCase: new GetSubcriptionPlanUseCase(
    adminRepositories.subcriptionPlanRepository
  ),
  updateSubscriptionPlanUseCase:new UpdateSubscriptionPlanUseCase(
    adminRepositories.subcriptionPlanRepository
  ),
  updateSubscriptionPlanStatus:new UpdateSubscriptionPlanStatusUseCase(
    adminRepositories.subcriptionPlanRepository
  ),
  getSubscriptionPlanByIdUseCase : new GetSubscriptionPlanByIdUseCase(
    adminRepositories.subcriptionPlanRepository
  ),
  createAdvertisementUseCase:new CreateAdvertisementUseCase(
    adminRepositories.advertisementRepository,
    storageProvider
  ),
  updateAdvertisementUseCase:new UpdateAdvertisementUseCase(
    adminRepositories.advertisementRepository,
    storageProvider
  ),
  getAllAdvertisementUseCase:new GetAllAdvertisementUseCase(
    adminRepositories.advertisementRepository
  ),
  updateStatusAdvertisement:new UpdateStatusAdvertisementUseCase(
    adminRepositories.advertisementRepository
  ),
  getAdvertisementById:new GetAdvertisementById(
    adminRepositories.advertisementRepository
  ),
  getReportsUseCase: new GetReportsUseCase(
    adminRepositories.reportRepository
  ),
  getReportSummaryUseCase: new GetReportSummaryUseCase(
    adminRepositories.reportRepository
  ),
  getReportByIdUseCase: new GetReportByIdUseCase(
    adminRepositories.reportRepository
  ),
  updateReportStatusUseCase: new UpdateReportStatusUseCase(
    adminRepositories.reportRepository,
    socketEmitterProxy,
    adminRepositories.userRepository,
    emailService
  ),
  getFinanceOverviewUseCase: new GetFinanceOverviewUseCase(
    adminRepositories.transactionRepository
  ),
  getRecentTransactionsUseCase: new GetRecentTransactionsUseCase(
    adminRepositories.transactionRepository
  ),
  generateFinanceReportUseCase: new GenerateFinanceReportUseCase(
    adminRepositories.transactionRepository
  ),
  handlePayoutUseCase: new HandlePayoutUseCase(
    adminRepositories.transactionRepository,
    trainerRepositories.trainerRepository
  ),
  getAdminDashboardStatsUseCase: new GetAdminDashboardStatsUseCase(
    adminRepositories.paymentRepository,
    adminRepositories.subscriptionRepository,
    adminRepositories.userRepository,
    adminRepositories.slotRepository
  )
};
