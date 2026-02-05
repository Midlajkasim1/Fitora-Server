
import { IUserRepository } from "@/domain/interfaces/repositories/user.repository";
import { IPasswordHasher } from "@/domain/interfaces/password.interface";
import { IOtpStore } from "@/domain/interfaces/otp-store.interface";
import { IBaseUseCase } from "@/application/interfaces/base-usecase.interface";
import { ResetPasswordDTO } from "@/application/dto/auth/request/reset-password.dto";
import { ResetPasswordResponseDTO } from "@/application/dto/auth/response/reset-password.dto";
import { AUTH_MESSAGES } from "@/domain/constants/messages.constants";

export class ResetPasswordUseCase implements IBaseUseCase<ResetPasswordDTO, ResetPasswordResponseDTO> {
  constructor(
    private readonly _userRepository: IUserRepository,
    private readonly _passwordHasher: IPasswordHasher,
    private readonly _otpStore: IOtpStore
  ) {}

  async execute(dto: ResetPasswordDTO): Promise<ResetPasswordResponseDTO> {
    const sessionKey = `reset-session:${dto.token}`;
    const session = await this._otpStore.get<{ email: string }>(sessionKey);

    if (!session) throw new Error(AUTH_MESSAGES.RESET_SESSION_EXPIRED);

    const hashedPassword = await this._passwordHasher.hash(dto.password);
    const user = await this._userRepository.findEntityByEmail(session.email);
    
    if (!user) throw new Error(AUTH_MESSAGES.USER_NOT_FOUND);

    await this._userRepository.updatePassword(user.id!, hashedPassword); 
    await this._otpStore.delete(sessionKey);

    return { message: AUTH_MESSAGES.PASSWORD_UPDATE,success:true };
  }
}