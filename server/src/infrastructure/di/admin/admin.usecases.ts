import { AdminLoginUseCase } from "@/application/usecases/admin/admin-login.usecase";
import { JwtTokenService } from "@/infrastructure/providers/auth/jwt-token.service";
import { BcryptPasswordHasher } from "@/infrastructure/providers/crypto/bcrypt-password.service";
import { adminRepositories } from "./admin.repositories";
import { GetAllUsersUseCase } from "@/application/usecases/admin/get-all-users.usecase";
import { UserBlockUsecase } from "@/application/usecases/admin/user-block.usecase";
import { GetAllTrainersUseCase } from "@/application/usecases/admin/get-all-trainers.usecase";
import { TrainerBlockUseCase } from "@/application/usecases/admin/trainer-block.usecase";
import { AdminRefreshUseCase } from "@/application/usecases/admin/admin-refresh.usecase";
import { GetAdminMeUseCase } from "@/application/usecases/admin/get-admin-me.usecase";
import { CreateSpecializationUseCase } from "@/application/usecases/specialization/create-specialization.usecase";
import { S3StorageProvider } from "@/infrastructure/providers/storage/s3-storage.provider";
import { UpdateSpecializationUsecase } from "@/application/usecases/specialization/update-specialization.usecase";
import { GetAllSpecializationUsecase } from "@/application/usecases/specialization/get-all-specializations.usecase";
import { BlockSpecializationUSeCase } from "@/application/usecases/specialization/specialization-block.usecase";
import { GetTrainerVerificationUseCase } from "@/application/usecases/admin/get-all-trainerVerfication.usecase";
import { UpdateApprovalStatusUseCase } from "@/application/usecases/admin/update-trainerApprovalStatus.usecase";
import { NodemailerEmailService } from "@/infrastructure/providers/email/nodemailer.service";
import { GetSpecializationByIdUseCase } from "@/application/usecases/specialization/get-specializationById.usecase";
import { GetTrainerVerificationByIdUseCase } from "@/application/usecases/admin/get-trainerVerificationById.usecase";
import { CreateWorkoutUseCase } from "@/application/usecases/workout/create-workout.usecase";
import { GetAllWorkoutUseCase } from "@/application/usecases/workout/getAll-workout.usecase";
import { GetWorkoutByIdUseCase } from "@/application/usecases/workout/getWorkoutById.usecase";
import { UpdateWorkoutUseCase } from "@/application/usecases/workout/update-workout.usecase";
import { UpdateWorkoutStatusUseCase } from "@/application/usecases/workout/update-workoutStatus.usecase";
import { CreateSubscriptionUseCase } from "@/application/usecases/subscription/create-subscription.usecase";
import { GetSubcriptionUseCase } from "@/application/usecases/subscription/get-subcription.usecase";
import { UpdateSubscriptionUseCase } from "@/application/usecases/subscription/update-subscription.usecase";
import { UpdateSubscriptionStatusUseCase } from "@/application/usecases/subscription/updateStatus-subscription.usecase";
import { GetSubscriptionByIdUseCase } from "@/application/usecases/subscription/get-subscriptionById.usecase";

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
  createSubscriptionUseCase: new CreateSubscriptionUseCase(
    adminRepositories.subcriptionRepository
  ),
  getSubscriptionUseCase: new GetSubcriptionUseCase(
    adminRepositories.subcriptionRepository
  ),
  updateSubscriptionUseCase:new UpdateSubscriptionUseCase(
    adminRepositories.subcriptionRepository
  ),
  updateSubscriptionStatus:new UpdateSubscriptionStatusUseCase(
    adminRepositories.subcriptionRepository
  ),
  getSubscriptionByIdUseCase : new GetSubscriptionByIdUseCase(
    adminRepositories.subcriptionRepository
  )
  


  
 

};
