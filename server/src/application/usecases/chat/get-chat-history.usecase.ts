import { ChatMessageEntity } from "@/domain/entities/chat/chat-message.entity";
import { IChatMessageRepository } from "@/domain/interfaces/repositories/chat-message.repository";
import { IBaseUseCase } from "@/application/interfaces/base-usecase.interface";

export interface GetChatHistoryInput {
  requesterId: string;
  otherUserId: string;
  page?: number;
  limit?: number;
}

export interface GetChatHistoryOutput {
  messages: ChatMessageEntity[];
  total: number;
  page: number;
  totalPages: number;
}

export class GetChatHistoryUseCase implements IBaseUseCase<GetChatHistoryInput, GetChatHistoryOutput> {
  constructor(private readonly _chatRepo: IChatMessageRepository) {}

  async execute(input: GetChatHistoryInput): Promise<GetChatHistoryOutput> {
    const { requesterId, otherUserId } = input;
    const page = Math.max(1, input.page ?? 1);
    const limit = Math.min(50, Math.max(1, input.limit ?? 20));
    const skip = (page - 1) * limit;

    const [messages, total] = await Promise.all([
      this._chatRepo.findConversation(requesterId, otherUserId, skip, limit),
      this._chatRepo.countConversation(requesterId, otherUserId),
    ]);

    // Mark messages from otherUser as read
    await this._chatRepo.markRead(otherUserId, requesterId);

    return {
      messages,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }
}
