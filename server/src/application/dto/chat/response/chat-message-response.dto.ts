import { ChatMessageEntity } from "@/domain/entities/chat/chat-message.entity";

export class ChatMessageResponseDTO {
  id!: string;
  senderId!: string;
  receiverId!: string;
  message!: string;
  isRead!: boolean;
  createdAt!: Date;

  static fromEntity(entity: ChatMessageEntity): ChatMessageResponseDTO {
    return {
      id: entity.id!,
      senderId: entity.senderId,
      receiverId: entity.receiverId,
      message: entity.message,
      isRead: entity.isRead,
      createdAt: entity.createdAt || new Date(),
    };
  }
}
