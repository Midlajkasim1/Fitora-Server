import { NotificationType } from "@/domain/constants/notification.constants";

export class NotificationEntity {
  private readonly _id?: string;
  private readonly _userId: string; 
  private readonly _title: string;
  private readonly _message: string;
  private readonly _type: NotificationType;
  private _isRead: boolean;
  private readonly _createdAt: Date;

  private constructor(props: {
    id?: string;
    userId: string;
    title: string;
    message: string;
    type: NotificationType;
    isRead: boolean;
    createdAt?: Date;
  }) {
    this._id = props.id;
    this._userId = props.userId;
    this._title = props.title;
    this._message = props.message;
    this._type = props.type;
    this._isRead = props.isRead;
    this._createdAt = props.createdAt || new Date();
  }

  static create(props: {
    id?: string;
    userId: string;
    title: string;
    message: string;
    type: NotificationType;
    isRead?: boolean;
    createdAt?: Date;
  }): NotificationEntity {
    return new NotificationEntity({
      ...props,
      isRead: props.isRead ?? false, 
    });
  }

  get id() { return this._id; }
  get userId() { return this._userId; }
  get title() { return this._title; }
  get message() { return this._message; }
  get type() { return this._type; }
  get isRead() { return this._isRead; }
  get createdAt() { return this._createdAt; }

 
  markAsRead(): void {
    this._isRead = true;
  }
}