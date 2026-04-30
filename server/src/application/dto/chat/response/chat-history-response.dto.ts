import { ChatMessageEntity } from "@/domain/entities/chat/chat-message.entity";
import { ChatMessageResponseDTO } from "./chat-message-response.dto";

export interface ChatHistoryResult {
  messages: ChatMessageEntity[];
  total: number;
  page: number;
  totalPages: number;
}

export class ChatHistoryResponseDTO {
  messages!: ChatMessageResponseDTO[];
  total!: number;
  page!: number;
  totalPages!: number;

  constructor(data: ChatHistoryResponseDTO) {
    Object.assign(this, data);
  }

  static fromResult(result: ChatHistoryResult): ChatHistoryResponseDTO {
    return new ChatHistoryResponseDTO({
      messages: result.messages.map((m: ChatMessageEntity) => ChatMessageResponseDTO.fromEntity(m)),
      total: result.total,
      page: result.page,
      totalPages: result.totalPages,
    });
  }
}
