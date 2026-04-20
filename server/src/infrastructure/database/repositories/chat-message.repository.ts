import { ChatMessageEntity } from "@/domain/entities/chat/chat-message.entity";
import { IChatMessageRepository } from "@/domain/interfaces/repositories/chat-message.repository";
import { ChatMessageMapper } from "../mappers/chat-message.mapper";
import { ChatMessageModel } from "../models/chat-message.model";
import { IChatMessageDocument } from "../interfaces/chat-message.document";
import { Types } from "mongoose";

export class ChatMessageRepository implements IChatMessageRepository {
  constructor(private readonly _mapper: ChatMessageMapper) {}

  async save(message: ChatMessageEntity): Promise<ChatMessageEntity> {
    const mongoData = this._mapper.toMongo(message);
    const doc = await ChatMessageModel.create(mongoData);
    return this._mapper.toEntity(doc as unknown as IChatMessageDocument);
  }

  async findConversation(
    userAId: string,
    userBId: string,
    skip: number,
    limit: number
  ): Promise<ChatMessageEntity[]> {
    const docs = await ChatMessageModel.find({
      $or: [
        {
          senderId: new Types.ObjectId(userAId),
          receiverId: new Types.ObjectId(userBId),
        },
        {
          senderId: new Types.ObjectId(userBId),
          receiverId: new Types.ObjectId(userAId),
        },
      ],
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()
      .exec();

    return docs.map((doc) => this._mapper.toEntity(doc as IChatMessageDocument));
  }

  async countConversation(userAId: string, userBId: string): Promise<number> {
    return ChatMessageModel.countDocuments({
      $or: [
        {
          senderId: new Types.ObjectId(userAId),
          receiverId: new Types.ObjectId(userBId),
        },
        {
          senderId: new Types.ObjectId(userBId),
          receiverId: new Types.ObjectId(userAId),
        },
      ],
    });
  }

  async markRead(senderId: string, receiverId: string): Promise<void> {
    await ChatMessageModel.updateMany(
      {
        senderId: new Types.ObjectId(senderId),
        receiverId: new Types.ObjectId(receiverId),
        isRead: false,
      },
      { $set: { isRead: true } }
    );
  }

  async hasUnread(senderId: string, receiverId: string): Promise<boolean> {
    const count = await ChatMessageModel.countDocuments({
      senderId: new Types.ObjectId(senderId),
      receiverId: new Types.ObjectId(receiverId),
      isRead: false,
    });
    return count > 0;
  }
}
