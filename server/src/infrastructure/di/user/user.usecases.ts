import { ForgotPasswordUseCase } from "@/application/usecases/auth/forgot-password.usecase";
import { GetMeUseCase } from "@/application/usecases/auth/get-me.usecase";
import { GoogleAuthUseCase } from "@/application/usecases/auth/google-auth.usecase";
import { LoginUseCase } from "@/application/usecases/auth/login.usecase";
import { RefreshTokenUseCase } from "@/application/usecases/auth/refresh-token.usecase";
import { RegisterUseCase } from "@/application/usecases/auth/register.usecase";
import { ResendOtpUseCase } from "@/application/usecases/auth/resend-otp.usecase";
import { ResetPasswordUseCase } from "@/application/usecases/auth/reset-password.usecase";
import { VerifyOtpUseCase } from "@/application/usecases/auth/verify-otp.usecase";
import { VerifyResetOtpUseCase } from "@/application/usecases/auth/verify-reset-otp.usecase";
import { GetAllSpecializationUsecase } from "@/application/usecases/specialization/get-all-specializations.usecase";
import { GetSpecializationByIdUseCase } from "@/application/usecases/specialization/get-specializationById.usecase";
import { GetSubcriptionPlanUseCase } from "@/application/usecases/subscription/get-subcriptionPlan.usecase";
import { GetSubscriptionPlanByIdUseCase } from "@/application/usecases/subscription/get-subscriptionByIdPlan.usecase";
import { ChangePasswordUseCase } from "@/application/usecases/user/change-password.usecase";
import { GetUserProfileUseCase } from "@/application/usecases/user/get-userProfile.usecase";
import { GetWorkoutSelectionUseCase } from "@/application/usecases/user/get-workoutSelection.usecase";
import { GetWorkoutBySpecializationUseCase } from "@/application/usecases/user/getWorkoutBySpecialization.usecase";
import { UpdateUserProfileUseCase } from "@/application/usecases/user/update-userProfile.usecase";
import { UploadProfileImageUseCase } from "@/application/usecases/user/upload-profileImage.usecase";
import { S3StorageProvider } from "@/infrastructure/providers/storage/s3-storage.provider";
import { GoogleTokenProvider } from "../../providers/auth/google-token.provider";
import { JwtTokenService } from "../../providers/auth/jwt-token.service";
import { BcryptPasswordHasher } from "../../providers/crypto/bcrypt-password.service";
import { NodemailerEmailService } from "../../providers/email/nodemailer.service";
import { RedisOtpStore } from "../../providers/redis/redis-otp.store";
import { userRepositories } from "./user.repositories";
import { PurchaseSubscriptionUseCase } from "@/application/usecases/subscription/purchase-subscription.usecase";
import { StripePaymentProvider } from "@/infrastructure/providers/payment/stripePayment";
import { HandleWebhookUseCase } from "@/application/usecases/subscription/handle-webhook.usecase";
import { SaveHealthMetricsUseCase } from "@/application/usecases/user/user-health-metrics.usecase";
import { CheckActiveSubscriptionUserUseCase } from "@/application/usecases/subscription/check-activeSubscriptionUser.usecase";
import { CancelSubscriptionUseCase } from "@/application/usecases/subscription/cancel-subscription.usecase";
import { GetPurchaseHistoryUseCase } from "@/application/usecases/subscription/get-purchaseHistory.usecase";
import { CheckHealthMetricsUseCase } from "@/application/usecases/user/check-health-metrics.usecase";
import { CheckUserBlockUseCase } from "@/application/usecases/auth/check-user-block.usecase";
import { GetActiveAdvertisementUseCase } from "@/application/usecases/user/get-activeAdvertisement.usecase";

const otpStore = new RedisOtpStore();
const emailService = new NodemailerEmailService();
const passwordHasher = new BcryptPasswordHasher();
const tokenService = new JwtTokenService();
const googleTokenProvider = new GoogleTokenProvider();
const storageProvider = new S3StorageProvider();
export const paymentProvider = new StripePaymentProvider();

export const useCases = {
  registerUseCase: new RegisterUseCase(
    userRepositories.userRepository,
    otpStore,
    emailService,
    passwordHasher
  ),

  verifyOtpUseCase: new VerifyOtpUseCase(
    otpStore,
    userRepositories.userRepository,
    tokenService,
  ),
  refreshTokenUseCase: new RefreshTokenUseCase(
    userRepositories.userRepository,
    tokenService
  ),
  resendOtpUseCase: new ResendOtpUseCase(
    otpStore,
    emailService
  )
  ,
  loginUseCase: new LoginUseCase(
    userRepositories.userRepository,
    userRepositories.trainerRepository,
    passwordHasher,
    tokenService
  ),
  googleAuthUseCase: new GoogleAuthUseCase(
    userRepositories.userRepository,
    userRepositories.trainerRepository,
    tokenService,
    googleTokenProvider
  ),
  forgotPasswordUseCase: new ForgotPasswordUseCase(
    userRepositories.userRepository,
    otpStore,
    emailService
  ),

  verifyResetOtpUseCase: new VerifyResetOtpUseCase(
    otpStore

  ),

  resetPasswordUseCase: new ResetPasswordUseCase(
    userRepositories.userRepository,
    passwordHasher,
    otpStore
  ),
  getMeUseCase: new GetMeUseCase(
    userRepositories.userRepository,
    userRepositories.trainerRepository

    
  ),
  checkUserBlockUseCase:new CheckUserBlockUseCase(
    userRepositories.userRepository
  ),
  getUserProfileUseCase:new GetUserProfileUseCase(
    userRepositories.userRepository,
    userRepositories.clientPreferenceRepository
  ),
  updateUserProfileUseCase : new UpdateUserProfileUseCase(
    userRepositories.userRepository,
    userRepositories.clientPreferenceRepository
  ),
  uploadProfileImageUseCase: new UploadProfileImageUseCase(
    userRepositories.userRepository,
    storageProvider

  ),
  changePasswordUseCase: new ChangePasswordUseCase(
    userRepositories.userRepository,
    passwordHasher
  ),
  getAllSpecializationUseCase: new GetAllSpecializationUsecase(
    userRepositories.specializationRepository
  ),
  getWorkoutBySpecializationById:new GetWorkoutBySpecializationUseCase(
    userRepositories.workoutRepository
  ),
  getUserSpecializationById:new GetSpecializationByIdUseCase(
    userRepositories.specializationRepository
  ),
  getWorkoutSelectionUseCase: new GetWorkoutSelectionUseCase(
    userRepositories.workoutRepository
  ),
  getUserSubscriptionPlanUseCase: new GetSubcriptionPlanUseCase(
    userRepositories.subscriptionPlanRepository
  ),
  getUserSubscriptionPlanByIdUseCase: new GetSubscriptionPlanByIdUseCase(
    userRepositories.subscriptionPlanRepository
  ),
  purchaseSubscriptionPlan:new PurchaseSubscriptionUseCase(
    userRepositories.subscriptionPlanRepository,
    userRepositories.subscriptionRepository,
    paymentProvider,
    userRepositories.paymentRepository

  ),
  handleWebhookUseCase:new HandleWebhookUseCase(
    userRepositories.paymentRepository,
    userRepositories.subscriptionRepository,
    userRepositories.subscriptionPlanRepository
  ),
  clientHealthMetricsUseCase:new SaveHealthMetricsUseCase(
    userRepositories.clientHealthMetricRepository
  ),
  checkActiveSubscriptionUser:new CheckActiveSubscriptionUserUseCase(
    userRepositories.subscriptionRepository,
    userRepositories.subscriptionPlanRepository
  ),
  cancelSubscriptionUseCase: new CancelSubscriptionUseCase(
    userRepositories.subscriptionRepository
  ),
  getPurchaseHistoryUseCase: new GetPurchaseHistoryUseCase(
    userRepositories.paymentRepository
  ),
  checkHealthMetricsUseCase:new CheckHealthMetricsUseCase(
    userRepositories.clientHealthMetricRepository
  ),
  getActiveAdvertisementUseCase: new GetActiveAdvertisementUseCase(
    userRepositories.advertisementRepository
  )

  
};

