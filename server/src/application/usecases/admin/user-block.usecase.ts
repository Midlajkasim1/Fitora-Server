import { BlockUserRequestDTO } from "../../dto/admin/request/block-user.dto";
import { IBaseUseCase } from "@/application/interfaces/base-usecase.interface";
import { BlockUserResponseDTO } from "@/application/dto/admin/response/block-user.dto";
import { IUserRepository } from "@/domain/interfaces/repositories/user.repository";
import { AUTH_MESSAGES } from "@/domain/constants/messages.constants";

export class UserBlockUsecase implements IBaseUseCase<BlockUserRequestDTO, BlockUserResponseDTO> {
  constructor(private readonly _userRepository: IUserRepository) {}

  async execute(dto: BlockUserRequestDTO): Promise<BlockUserResponseDTO> {
    const user = await this._userRepository.findById(dto.userId);

    if (!user) {
      throw new Error(AUTH_MESSAGES.USER_NOT_FOUND);
    }

    user.toggleStatus(); 
    const newStatus = user.status;

    await this._userRepository.updateStatus(user.id!, newStatus);

    return {
      id: user.id!,
      email: user.email,
      status: newStatus,
      message: AUTH_MESSAGES.USER_STATUS_UPDATED(newStatus),
    };
  }
}