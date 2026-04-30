export class SendMessageRequestDTO {
  senderId!: string;
  receiverId!: string;
  message!: string;

  constructor(data: SendMessageRequestDTO) {
    Object.assign(this, data);
  }
}
