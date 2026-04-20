import { ChatMessageEntity } from "@/domain/entities/chat/chat-message.entity";

export interface IChatMessageRepository {
  save(message: ChatMessageEntity): Promise<ChatMessageEntity>;
  findConversation(
    userAId: string,
    userBId: string,
    skip: number,
    limit: number
  ): Promise<ChatMessageEntity[]>;
  countConversation(userAId: string, userBId: string): Promise<number>;
  markRead(senderId: string, receiverId: string): Promise<void>;
  hasUnread(senderId: string, receiverId: string): Promise<boolean>;
}
