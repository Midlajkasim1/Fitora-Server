import { ChatMessageEntity } from "@/domain/entities/chat/chat-message.entity";

export class ChatMessageResponseDTO {
  id!: string;
  senderId!: string;
  receiverId!: string;
  message!: string;
  attachmentUrl?: string;
  attachmentType?: 'image' | 'video' | 'audio' | 'file';
  isRead!: boolean;
  createdAt!: Date;

  constructor(data: ChatMessageResponseDTO) {
    Object.assign(this, data);
  }

  static fromEntity(entity: ChatMessageEntity): ChatMessageResponseDTO {
    return new ChatMessageResponseDTO({
      id: entity.id!,
      senderId: entity.senderId,
      receiverId: entity.receiverId,
      message: entity.message,
      attachmentUrl: entity.attachmentUrl,
      attachmentType: entity.attachmentType,
      isRead: entity.isRead,
      createdAt: entity.createdAt!,
    });
  }
}
