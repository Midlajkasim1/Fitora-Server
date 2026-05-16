export interface ChatMessageProps {
  senderId: string;
  receiverId: string;
  message: string;
  isRead?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export class ChatMessageEntity {
  readonly id: string;
  readonly senderId: string;
  readonly receiverId: string;
  readonly message: string;
  readonly isRead: boolean;
  readonly createdAt?: Date;
  readonly updatedAt?: Date;

  constructor(props: ChatMessageProps, id?: string) {
    this.id = id || "";
    this.senderId = props.senderId;
    this.receiverId = props.receiverId;
    this.message = props.message;
    this.isRead = props.isRead || false;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  static create(props: Omit<ChatMessageProps, "isRead" | "createdAt" | "updatedAt">): ChatMessageEntity {
    return new ChatMessageEntity({
      ...props,
      isRead: false,
      createdAt: new Date(),
    });
  }
}
