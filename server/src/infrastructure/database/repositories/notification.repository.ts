import { Model, Types } from "mongoose";
import { NotificationEntity } from "@/domain/entities/notification/notification.entity";
import { NotificationModel } from "../models/notification.model";
import { BaseRepository } from "./base.repository";
import { INotificationDocument } from "../interfaces/notification.document.interface";
import { NotificationMapper } from "../mappers/notification.mapper";
import { INotificationRepository } from "@/domain/interfaces/repositories/notification.repository";

export class NotificationRepository 
  extends BaseRepository<NotificationEntity, INotificationDocument> 
  implements INotificationRepository
{
  constructor(private readonly _notificationMapper: NotificationMapper) {
    super(NotificationModel as unknown as Model<INotificationDocument>, _notificationMapper);
  }

  async findByUserId(userId: string, limit: number = 20): Promise<NotificationEntity[]> {
    const docs = await this.model
      .find({ userId: new Types.ObjectId(userId) })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean()
      .exec();

    return docs.map((doc) => this._notificationMapper.toEntity(doc as INotificationDocument));
  }

  async markAsRead(notificationId: string): Promise<void> {
    await this.model.findByIdAndUpdate(
      notificationId, 
      { $set: { isRead: true } }
    ).exec();
  }

  async markAllAsRead(userId: string): Promise<void> {
    await this.model.updateMany(
      { userId: new Types.ObjectId(userId), isRead: false },
      { $set: { isRead: true } }
    ).exec();
  }

  async clearAll(userId: string): Promise<void> {
    await this.model.deleteMany({ 
      userId: new Types.ObjectId(userId) 
    }).exec();
  }
}