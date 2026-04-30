import { MarkMessagesReadRequestDTO } from "@/application/dto/chat/request/mark-messages-read.dto";
import { IBaseUseCase } from "@/application/interfaces/base-usecase.interface";
import { IChatMessageRepository } from "@/domain/interfaces/repositories/chat-message.repository";



export class MarkMessagesReadUseCase implements IBaseUseCase<MarkMessagesReadRequestDTO, void> {
  constructor(private readonly _chatRepository: IChatMessageRepository) {}

  async execute(dto: MarkMessagesReadRequestDTO): Promise<void> {
    await this._chatRepository.markRead(dto.senderId, dto.receiverId);
  }
}
