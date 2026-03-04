import { GoogleAuthUseCase } from "@/application/usecases/auth/google-auth.usecase";
import { LoginUseCase } from "@/application/usecases/auth/login.usecase";
import { RegisterUseCase } from "@/application/usecases/auth/register.usecase";
import { ResendOtpUseCase } from "@/application/usecases/auth/resend-otp.usecase";
import { VerifyOtpUseCase } from "@/application/usecases/auth/verify-otp.usecase";
import { GoogleTokenProvider } from "../../providers/auth/google-token.provider";
import { JwtTokenService } from "../../providers/auth/jwt-token.service";
import { BcryptPasswordHasher } from "../../providers/crypto/bcrypt-password.service";
import { NodemailerEmailService } from "../../providers/email/nodemailer.service";
import { RedisOtpStore } from "../../providers/redis/redis-otp.store";
import { userRepositories } from "./user.repositories";
import { ForgotPasswordUseCase } from "@/application/usecases/auth/forgot-password.usecase";
import { ResetPasswordUseCase } from "@/application/usecases/auth/reset-password.usecase";
import { VerifyResetOtpUseCase } from "@/application/usecases/auth/verify-reset-otp.usecase";
import { RefreshTokenUseCase } from "@/application/usecases/auth/refresh-token.usecase";
import { GetMeUseCase } from "@/application/usecases/auth/get-me.usecase";
import { GetUserProfileUseCase } from "@/application/usecases/user/get-userProfile.usecase";
import { UpdateUserProfileUseCase } from "@/application/usecases/user/update-userProfile.usecase";
import { S3StorageProvider } from "@/infrastructure/providers/storage/s3-storage.provider";
import { UploadProfileImageUseCase } from "@/application/usecases/user/upload-profileImage.usecase";
import { ChangePasswordUseCase } from "@/application/usecases/user/change-password.usecase";
import { GetAllSpecializationUsecase } from "@/application/usecases/specialization/get-all-specializations.usecase";
import { GetSpecializationByIdUseCase } from "@/application/usecases/specialization/get-specializationById.usecase";
import { GetWorkoutBySpecializationUseCase } from "@/application/usecases/user/getWorkoutBySpecialization.usecase";
import { GetWorkoutSelectionUseCase } from "@/application/usecases/user/get-workoutSelection.usecase";
import { GetSubcriptionUseCase } from "@/application/usecases/subscription/get-subcription.usecase";
import { GetSubscriptionByIdUseCase } from "@/application/usecases/subscription/get-subscriptionById.usecase";

const otpStore = new RedisOtpStore();
const emailService = new NodemailerEmailService();
const passwordHasher = new BcryptPasswordHasher();
const tokenService = new JwtTokenService();
const googleTokenProvider = new GoogleTokenProvider();
const storageProvider = new S3StorageProvider();

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
  getUserSubscriptionUseCase: new GetSubcriptionUseCase(
    userRepositories.subscriptionRepository
  ),
  getUserSubscriptionByIdUseCase: new GetSubscriptionByIdUseCase(
    userRepositories.subscriptionRepository
  )
  
};

