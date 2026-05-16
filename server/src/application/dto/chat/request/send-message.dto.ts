export class SendMessageRequestDTO {
  senderId!: string;
  receiverId!: string;
  message!: string;
  attachmentUrl?: string;
  attachmentType?: string;

  constructor(data: SendMessageRequestDTO) {
    Object.assign(this, data);
  }
}
