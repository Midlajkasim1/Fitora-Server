import { GetMeResponseDTO } from "@/application/dto/auth/response/get-me.dto";
import { IBaseUseCase } from "@/application/interfaces/base-usecase.interface";
import { AUTH_MESSAGES } from "@/domain/constants/messages.constants";
import { IUserRepository } from "@/domain/interfaces/repositories/user.repository";

export class GetMeUseCase implements IBaseUseCase<string, GetMeResponseDTO> {
  constructor(private readonly _userRepository: IUserRepository) {}

  async execute(userId: string): Promise<GetMeResponseDTO> {
    const user = await this._userRepository.findById(userId);

    if (!user) {
      throw new Error(AUTH_MESSAGES.USER_NOT_FOUND);
    }

    return {
      id: user.id!,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      status: user.status,
      isOnboardingRequired: user.isOnboardingRequired,
      profileImage: user.profileImage,
      approval_status: user.approvalStatus
    };
  }
}