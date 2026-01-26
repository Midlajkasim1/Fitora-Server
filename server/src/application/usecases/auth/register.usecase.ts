import { IOtpStore } from "@/domain/interfaces/otp-store.interface";
import { IEmailService } from "@/domain/interfaces/email-service.interface";
import { randomInt } from "crypto";
import { IPasswordHasher } from "@/domain/interfaces/password.interface";
import { RegisterResponseDTO } from "@/application/dto/auth/response/register.dto";
import { RegisterDTO } from "@/application/dto/auth/request/register.dto";
import { IBaseUseCase } from "@/application/interfaces/base-usecase.interface";
import { logger } from "@/infrastructure/providers/loggers/logger";
import { IUserRepository } from "@/domain/interfaces/repositories/user.repository";
export class RegisterUseCase implements IBaseUseCase<RegisterDTO, RegisterResponseDTO> {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly otpStore: IOtpStore,
    private readonly emailService: IEmailService,
    private readonly passwordHasher: IPasswordHasher
  ) { }

  async execute(dto: RegisterDTO): Promise<RegisterResponseDTO> {

   const existingUser = await this.userRepository.findByEmail(dto.email);
    if (existingUser) {
      throw new Error("User with this email already exists");
    }
    const hashedPassword = await this.passwordHasher.hash(dto.password);

    const otp = randomInt(100000, 999999).toString();
    const ttl = 300;

    const redisKey = `otp:register:${dto.email}`;

    await this.otpStore.save(
      redisKey,
      {
        ...dto,
        password: hashedPassword,
        otp,
      },
      ttl
    );
    logger.info(`OTP generated: ${otp}`);
    await this.emailService.sendOtp(dto.email, otp);
    return { message: "OTP sent successfully" };


  }
}
