import { GetMeResponseDTO } from "@/application/dto/auth/response/get-me.dto";
import { IBaseUseCase } from "@/application/interfaces/base-usecase.interface";
import { ApprovalStatus, UserRole } from "@/domain/constants/auth.constants";
import { AUTH_MESSAGES } from "@/domain/constants/messages.constants";
import { ITrainerRepository } from "@/domain/interfaces/repositories/onboarding/itrainer.repository";
import { IUserRepository } from "@/domain/interfaces/repositories/user.repository";

export class GetMeUseCase implements IBaseUseCase<string, GetMeResponseDTO> {
  constructor(
    private readonly _userRepository: IUserRepository,
    private readonly _trainerRepository:ITrainerRepository


  ) {}

  async execute(userId: string): Promise<GetMeResponseDTO> {
    const user = await this._userRepository.findById(userId);

    if (!user) {
      throw new Error(AUTH_MESSAGES.USER_NOT_FOUND);
    }
    let approvalStatus: ApprovalStatus = ApprovalStatus.PENDING ;
    if(user.role === UserRole.TRAINER){
      const trainer = await this._trainerRepository.findByUserId(user.id!);
      approvalStatus = trainer?.approvalStatus as ApprovalStatus;
    }
    

    return new GetMeResponseDTO( {
      id: user.id!,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      status: user.status,
      isOnboardingRequired: user.isOnboardingRequired,
      profileImage: user.profileImage,
      approval_status: approvalStatus
    });
  }
}