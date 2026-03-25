import { BlockTrainerResponseDTO } from "@/application/dto/admin/response/block-trainer.dto";
import { IBaseUseCase } from "@/application/interfaces/base-usecase.interface";
import { AUTH_MESSAGES } from "@/domain/constants/messages.constants";
import { IUserRepository } from "@/domain/interfaces/repositories/user.repository";
import { BlockUserRequestDTO } from "../../dto/admin/request/block-user.dto";
import { BlockUserResponseDTO } from "../../dto/admin/response/block-user.dto";

export class TrainerBlockUseCase implements IBaseUseCase<BlockUserRequestDTO, BlockUserResponseDTO> {
  constructor(private readonly _userRepository: IUserRepository) {}

  async execute(dto: BlockUserRequestDTO): Promise<BlockTrainerResponseDTO> {
    const trainer = await this._userRepository.findById(dto.userId);

    if (!trainer) {
      throw new Error("Trainer not found");
    }
    trainer.toggleStatus();
    
    await this._userRepository.updateStatus(trainer.id!, trainer.status);

    return new BlockTrainerResponseDTO({
      id: trainer.id!,
      email: trainer.email,
      status: trainer.status,
      message: AUTH_MESSAGES.TRAINER_STATUS_UPDATED(trainer.status),
    });
  }
}