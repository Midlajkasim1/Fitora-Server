
import { IUserRepository } from "@/domain/interfaces/repositories/user.repository";
import { IPasswordHasher } from "@/domain/interfaces/password.interface";
import { IOtpStore } from "@/domain/interfaces/otp-store.interface";
import { IBaseUseCase } from "@/application/interfaces/base-usecase.interface";
import { ResetPasswordDTO } from "@/application/dto/auth/request/reset-password.dto";
import { ResetPasswordResponseDTO } from "@/application/dto/auth/response/reset-password.dto";

export class ResetPasswordUseCase implements IBaseUseCase<ResetPasswordDTO, ResetPasswordResponseDTO> {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly passwordHasher: IPasswordHasher,
    private readonly otpStore: IOtpStore
  ) {}

  async execute(dto: ResetPasswordDTO): Promise<ResetPasswordResponseDTO> {
    const sessionKey = `reset-session:${dto.token}`;
    const session = await this.otpStore.get<{ email: string }>(sessionKey);

    if (!session) throw new Error("Reset session expired. Please restart the process.");

    const hashedPassword = await this.passwordHasher.hash(dto.password);
    const user = await this.userRepository.findEntityByEmail(session.email);
    
    if (!user) throw new Error("User not found");

    await this.userRepository.updatePassword(user.id!, hashedPassword); 
    await this.otpStore.delete(sessionKey);

    return { message: "Password updated successfully",success:true };
  }
}