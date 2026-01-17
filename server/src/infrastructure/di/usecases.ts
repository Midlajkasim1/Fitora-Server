import { RedisOtpStore } from "../providers/redis/redis-otp.store";
import { NodemailerEmailService } from "../providers/email/nodemailer.service";
import { RegisterUseCase } from "@/application/usecases/auth/register.usecase";
import { VerifyOtpUseCase } from "@/application/usecases/auth/verify-otp.usecase";
import { repositories } from "./repositories";

const otpStore = new RedisOtpStore();
const emailService = new NodemailerEmailService();

export const useCases = {
  registerUseCase: new RegisterUseCase(
    otpStore,
    emailService
  ),

  verifyOtpUseCase: new VerifyOtpUseCase(
    otpStore,
    repositories.userRepository
  ),
};
