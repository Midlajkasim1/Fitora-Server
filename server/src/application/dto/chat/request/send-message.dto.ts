export class SendMessageRequestDTO {
  receiverId!: string;
  message!: string;

  constructor(data: SendMessageRequestDTO) {
    Object.assign(this, data);
  }
}
