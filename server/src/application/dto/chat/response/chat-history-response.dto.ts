import { ChatMessageResponseDTO } from "./chat-message-response.dto";

export class ChatHistoryResponseDTO {
  messages!: ChatMessageResponseDTO[];
  total!: number;
  page!: number;
  totalPages!: number;

  constructor(data: ChatHistoryResponseDTO) {
    Object.assign(this, data);
  }

  static fromResult(result: any): ChatHistoryResponseDTO {
    return new ChatHistoryResponseDTO({
      messages: result.messages.map((m: any) => ChatMessageResponseDTO.fromEntity(m)),
      total: result.total,
      page: result.page,
      totalPages: result.totalPages,
    });
  }
}
