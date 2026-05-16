export class SendMessageRequestDTO {
  senderId!: string;
  receiverId!: string;
  message!: string;
  attachmentUrl?: string;
  attachmentType?: "image" | "video" | "audio" | "file";

  constructor(data: SendMessageRequestDTO) {
    Object.assign(this, data);
  }
}
