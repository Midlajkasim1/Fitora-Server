import { IOtpStore } from "@/domain/interfaces/otp-store.interface";
import { IUserRepository } from "@/domain/interfaces/repositories/user.repository";
import { UserEntity } from "@/domain/entities/user.entity";

export class VerifyOtpUseCase {
  constructor(
    private readonly otpStore: IOtpStore,
    private readonly userRepository: IUserRepository
  ) {}

  async execute(email: string, otp: string) {
    const redisKey = `otp:register:${email}`;

    const stored = await this.otpStore.get<any>(redisKey);
    if (!stored) {
      throw new Error("OTP expired or invalid");
    }

    if (stored.otp !== otp) {
      throw new Error("Invalid OTP");
    }

    const user = UserEntity.create({
      email: stored.email,
      firstName: stored.firstName,
      lastName: stored.lastName,
      phone: stored.phone,
      role: stored.role,
      isEmailVerified: true, 
    });

    await this.userRepository.create(user, stored.password);

    await this.otpStore.delete(redisKey);

    return { message: "Account verified successfully" };
  }
}
