import { ChatMessageEntity } from "@/domain/entities/chat/chat-message.entity";

export interface GetChatHistoryResponseDTO {
  messages: ChatMessageEntity[];
  total: number;
  page: number;
  totalPages: number;
}
