import { RedisOtpStore } from "../providers/redis/redis-otp.store";
import { NodemailerEmailService } from "../providers/email/nodemailer.service";
import { RegisterUseCase } from "@/application/usecases/auth/register.usecase";
import { VerifyOtpUseCase } from "@/application/usecases/auth/verify-otp.usecase";
import { repositories } from "./repositories";
import { BcryptPasswordHasher } from "../providers/crypto/bcrypt-password.service";
import { LoginUseCase } from "@/application/usecases/auth/login.usecase";
import { JwtTokenService } from "../providers/auth/jwt-token.service";

const otpStore = new RedisOtpStore();
const emailService = new NodemailerEmailService();
const passwordHasher = new BcryptPasswordHasher()
const tokenService = new JwtTokenService();
export const useCases = {
  registerUseCase: new RegisterUseCase(
    otpStore,
    emailService,
    passwordHasher
  ),

  verifyOtpUseCase: new VerifyOtpUseCase(
    otpStore,
    repositories.userRepository
  ),
    loginUseCase: new LoginUseCase(
    repositories.userRepository,
    passwordHasher,
    tokenService
  ),
};
