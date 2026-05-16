export interface ChatMessageProps {
  id?: string;
  senderId: string;
  receiverId: string;
  message: string;
  attachmentUrl?: string;
  attachmentType?: 'image' | 'video' | 'audio' | 'file';
  isRead?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export class ChatMessageEntity {
  readonly id?: string;
  readonly senderId: string;
  readonly receiverId: string;
  readonly message: string;
  readonly attachmentUrl?: string;
  readonly attachmentType?: 'image' | 'video' | 'audio' | 'file';
  readonly isRead: boolean;
  readonly createdAt?: Date;
  readonly updatedAt?: Date;

  constructor(props: ChatMessageProps) {
    this.id = props.id;
    this.senderId = props.senderId;
    this.receiverId = props.receiverId;
    this.message = props.message;
    this.attachmentUrl = props.attachmentUrl;
    this.attachmentType = props.attachmentType;
    this.isRead = props.isRead ?? false;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  static create(props: Omit<ChatMessageProps, "id" | "isRead" | "createdAt" | "updatedAt">): ChatMessageEntity {
    return new ChatMessageEntity({
      ...props,
      isRead: false,
      createdAt: new Date(),
    });
  }
}
