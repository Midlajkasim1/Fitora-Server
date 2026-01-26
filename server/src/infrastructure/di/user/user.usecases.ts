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

const otpStore = new RedisOtpStore();
const emailService = new NodemailerEmailService();
const passwordHasher = new BcryptPasswordHasher();
const tokenService = new JwtTokenService();
const googleTokenProvider = new GoogleTokenProvider();
export const useCases = {
  registerUseCase: new RegisterUseCase(
    userRepositories.userRepository,
    otpStore,
    emailService,
    passwordHasher
  ),

  verifyOtpUseCase: new VerifyOtpUseCase(
    otpStore,
    userRepositories.userRepository
  ),
  resendOtpUseCase: new ResendOtpUseCase(
    otpStore,
    emailService
  )
  ,
  loginUseCase: new LoginUseCase(
    userRepositories.userRepository,
    passwordHasher,
    tokenService
  ),
  googleAuthUseCase: new GoogleAuthUseCase(
    userRepositories.userRepository,
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
  )
};

