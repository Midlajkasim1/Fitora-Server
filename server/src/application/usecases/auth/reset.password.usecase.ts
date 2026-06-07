
import { ResetPasswordDTO } from "@/application/dto/auth/request/reset.password.dto";
import { ResetPasswordResponseDTO } from "@/application/dto/auth/response/reset.password.dto";
import { IBaseUseCase } from "@/application/interfaces/base.usecase.interface";
import { AUTH_MESSAGES } from "@/domain/constants/messages.constants";
import { IUserRepository } from "@/domain/interfaces/repositories/user.repository";
import { IOtpStore } from "@/domain/interfaces/services/otp-store.interface";
import { IPasswordHasher } from "@/domain/interfaces/services/password.interface";
import { CustomError } from "@/shared/errors/custom.error";
import { HttpStatus } from "@/domain/constants/http.status.constants";

export class ResetPasswordUseCase implements IBaseUseCase<ResetPasswordDTO, ResetPasswordResponseDTO> {
  constructor(
    private readonly _userRepository: IUserRepository,
    private readonly _passwordHasher: IPasswordHasher,
    private readonly _otpStore: IOtpStore
  ) {}

  async execute(dto: ResetPasswordDTO): Promise<ResetPasswordResponseDTO> {
    const sessionKey = `reset-session:${dto.token}`;
    const session = await this._otpStore.get<{ email: string }>(sessionKey);

    if (!session) {
      throw new CustomError(AUTH_MESSAGES.RESET_SESSION_EXPIRED, HttpStatus.BAD_REQUEST);
    }

    const hashedPassword = await this._passwordHasher.hash(dto.password);
    const user = await this._userRepository.findEntityByEmail(session.email);
    
    if (!user) {
      throw new CustomError(AUTH_MESSAGES.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    await this._userRepository.updatePassword(user.id!, hashedPassword); 
    await this._otpStore.delete(sessionKey);

    return new ResetPasswordResponseDTO({ message: AUTH_MESSAGES.PASSWORD_UPDATE,success:true });
  }
}