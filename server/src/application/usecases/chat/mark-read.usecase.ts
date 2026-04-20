import { IBaseUseCase } from "@/application/interfaces/base-usecase.interface";
import { IChatMessageRepository } from "@/domain/interfaces/repositories/chat-message.repository";

export interface MarkMessagesReadDTO {
  senderId: string;
  receiverId: string;
}

export class MarkMessagesReadUseCase implements IBaseUseCase<MarkMessagesReadDTO, void> {
  constructor(private readonly _chatRepository: IChatMessageRepository) {}

  async execute(dto: MarkMessagesReadDTO): Promise<void> {
    await this._chatRepository.markRead(dto.senderId, dto.receiverId);
  }
}
