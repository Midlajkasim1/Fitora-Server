import { IChatMessageRepository } from "@/domain/interfaces/repositories/chat-message.repository";
import { IBaseUseCase } from "@/application/interfaces/base-usecase.interface";
import { GetChatHistoryRequestDTO } from "@/application/dto/chat/request/get-chat-history.dto";
import { GetChatHistoryResponseDTO } from "@/application/dto/chat/response/get-chat-history.dto";



export class GetChatHistoryUseCase implements IBaseUseCase<GetChatHistoryRequestDTO, GetChatHistoryResponseDTO> {
  constructor(private readonly _chatRepo: IChatMessageRepository) {}

  async execute(input: GetChatHistoryRequestDTO): Promise<GetChatHistoryResponseDTO> {
    const { requesterId, otherUserId } = input;
    const page = Math.max(1, input.page ?? 1);
    const limit = Math.min(50, Math.max(1, input.limit ?? 20));
    const skip = (page - 1) * limit;

    const [messages, total] = await Promise.all([
      this._chatRepo.findConversation(requesterId, otherUserId, skip, limit),
      this._chatRepo.countConversation(requesterId, otherUserId),
    ]);

    await this._chatRepo.markRead(otherUserId, requesterId);

    return {
      messages,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }
}
